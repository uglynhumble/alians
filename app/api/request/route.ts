import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const schema = z.object({
  task: z.string().min(2).max(100),
  springType: z.string().min(2).max(100),
  details: z.string().min(10).max(5000),
  quantity: z.coerce.number().int().positive(),
  prototype: z.string(),
  name: z.string().min(2).max(100),
  company: z.string().max(200),
  email: z.email(),
  phone: z.string().max(50),
  consent: z.literal("true"),
  website: z.string().max(0).optional(),
});

const MAX_FILE_SIZE = 20 * 1024 * 1024;

function escapeHtml(value: string | number) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function smtpConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD);
}

async function sendEmail(data: z.infer<typeof schema>, files: File[]) {
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER!;
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user, pass: process.env.SMTP_PASSWORD! },
    tls: { minVersion: "TLSv1.2" },
  });
  const recipient = process.env.SALES_EMAIL || user;
  const from = process.env.SMTP_FROM || user;
  const rows: Array<[string, string | number]> = [
    ["Задача", data.task],
    ["Тип изделия", data.springType],
    ["Количество", data.quantity],
    ["Нужен прототип", data.prototype === "true" ? "Да" : "Нет"],
    ["Имя", data.name],
    ["Компания", data.company || "—"],
    ["Email", data.email],
    ["Телефон", data.phone || "—"],
    ["Описание", data.details],
  ];
  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<h2>Новая заявка с сайта</h2><table>${rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:6px 16px 6px 0"><strong>${escapeHtml(label)}</strong></td><td style="padding:6px 0">${escapeHtml(value).replaceAll("\n", "<br>")}</td></tr>`,
    )
    .join("")}</table>`;
  const attachments = await Promise.all(
    files.map(async (file) => ({
      filename: file.name.replace(/[\\/]/g, "_"),
      content: Buffer.from(await file.arrayBuffer()),
      contentType: file.type || undefined,
    })),
  );

  await transporter.sendMail({
    from,
    to: recipient,
    replyTo: { name: data.name, address: data.email },
    subject: `Заявка с сайта: ${data.springType} — ${data.name}`,
    text,
    html,
    attachments,
  });
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const parsed = schema.safeParse(Object.fromEntries(form.entries()));
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Некорректные данные формы" }, { status: 400 });
    }

    const files = form.getAll("files").filter((item): item is File => item instanceof File);
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      return NextResponse.json({ ok: false, error: "Файл превышает 20 МБ" }, { status: 413 });
    }

    const deliveries: Promise<unknown>[] = [];
    if (smtpConfigured()) deliveries.push(sendEmail(parsed.data, files));
    if (process.env.CRM_WEBHOOK_URL) {
      deliveries.push(
        fetch(process.env.CRM_WEBHOOK_URL, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...parsed.data, fileNames: files.map((file) => file.name) }),
        }).then((response) => {
          if (!response.ok) throw new Error(`CRM webhook failed (${response.status})`);
        }),
      );
    }

    if (deliveries.length === 0) {
      console.error("Request delivery is not configured");
      return NextResponse.json({ ok: false, error: "Отправка заявок временно недоступна" }, { status: 503 });
    }

    const results = await Promise.allSettled(deliveries);
    const delivered = results.some((result) => result.status === "fulfilled");
    for (const result of results) {
      if (result.status === "rejected") console.error("Request delivery failed", result.reason);
    }
    if (!delivered) {
      return NextResponse.json({ ok: false, error: "Не удалось доставить заявку" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Request API failed", error);
    return NextResponse.json({ ok: false, error: "Не удалось обработать заявку" }, { status: 500 });
  }
}
