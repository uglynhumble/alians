"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, ChevronDown, FileUp, Menu, Phone, X } from "lucide-react";
import { company, faq } from "./content";

export function Header() {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [["Продукция", "#products"], ["Возможности", "#capabilities"], ["Качество", "#quality"], ["Этапы", "#stages"], ["FAQ", "#faq"], ["Контакты", "#contacts"]];
  return <header className={`header ${compact ? "header--compact" : ""}`}>
    <div className="container header__inner">
      <a className="brand" href="#top" aria-label="Спрингс Альянс — на главную">
        <span className="source-logo" aria-hidden="true"/>
        <span><b>{company.name}</b><small>{company.descriptor}</small></span>
      </a>
      <nav className={`nav ${open ? "nav--open" : ""}`} aria-label="Основная навигация">
        {links.map(([label, href]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>)}
      </nav>
      <div className="header__actions">
        {company.phoneHref ? <a className="header__phone" href={`tel:${company.phoneHref}`}><Phone size={16}/>{company.phoneLabel}</a> : null}
        <a className="button button--small" href="#request">Отправить чертёж</a>
        <button className="menu" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label={open ? "Закрыть меню" : "Открыть меню"}>{open ? <X/> : <Menu/>}</button>
      </div>
    </div>
  </header>;
}

export function ProductGraphic({ type }: { type: string }) {
  return <svg className="product-graphic" viewBox="0 0 240 120" role="img" aria-label="Техническая иллюстрация изделия">
    <defs><linearGradient id={`steel-${type}`} x1="0" x2="1"><stop stopColor="#87919b"/><stop offset=".5" stopColor="#eff3f4"/><stop offset="1" stopColor="#5b6570"/></linearGradient></defs>
    <g fill="none" stroke={`url(#steel-${type})`} strokeWidth="9" strokeLinecap="round" strokeLinejoin="round">
      {type === "compression" && <path d="M36 83 C48 83 48 37 60 37 S72 83 84 83 96 37 108 37 120 83 132 83 144 37 156 37 168 83 180 83 192 37 204 37"/>}
      {type === "extension" && <><path d="M18 60c20-38 35 0 48 0M66 60c8-30 16 30 24 0s16 30 24 0 16 30 24 0 16 30 24 0 16 30 24 0M186 60c13 0 28 38 38 0"/></>}
      {type === "torsion" && <><ellipse cx="120" cy="60" rx="50" ry="34"/><ellipse cx="120" cy="60" rx="36" ry="24"/><path d="M73 40 35 18M167 81l40 22"/></>}
      {type === "valve" && <path d="M60 91C72 91 69 28 84 28s13 63 28 63 13-63 28-63 13 63 28 63 13-63 28-63"/>}
      {type === "damper" && <><circle cx="120" cy="60" r="42"/><path d="M91 31c22 13 36 44 58 58M149 31c-22 13-36 44-58 58"/></>}
      {type === "ring" && <><path d="M78 27a50 50 0 1 0 86 49"/><circle cx="78" cy="27" r="5"/><circle cx="164" cy="76" r="5"/></>}
      {type === "hose" && <path d="M30 84 42 36l14 48 14-48 14 48 14-48 14 48 14-48 14 48 14-48 14 48 14-48 14 48"/>}
      {type === "wire" && <path d="M30 92 62 28h34v64h36V45h42l34 47"/>}
    </g>
  </svg>;
}

export function Faq() {
  return <div className="faq-list">{faq.map(([q, a], i) => <details key={q} open={i === 0} onToggle={() => window.dispatchEvent(new CustomEvent("analytics", { detail: "faq_open" }))}>
    <summary><span>{q}</span><ChevronDown aria-hidden="true"/></summary><p>{a}</p>
  </details>)}</div>;
}

type FormData = { task: string; springType: string; details: string; quantity: string; prototype: boolean; name: string; company: string; email: string; phone: string; consent: boolean };

export function RequestForm() {
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [data, setData] = useState<FormData>({ task: "По чертежу", springType: "Пружина сжатия", details: "", quantity: "", prototype: false, name: "", company: "", email: "", phone: "", consent: false });
  const formRef = useRef<HTMLFormElement>(null);
  const update = (key: keyof FormData, value: string | boolean) => setData(v => ({ ...v, [key]: value }));
  const valid = step === 1 ? !!data.task : step === 2 ? data.details.trim().length >= 10 && Number(data.quantity) > 0 : !!data.name && /.+@.+\..+/.test(data.email) && data.consent;
  const next = () => { if (valid) { setStep(s => Math.min(3, s + 1)); setStatus(""); } else setStatus("Проверьте обязательные поля этого шага."); };
  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!valid) return setStatus("Заполните имя, корректный email и подтвердите согласие.");
    setStatus("Отправляем заявку…");
    const body = new FormData(); Object.entries(data).forEach(([k, v]) => body.append(k, String(v))); files.forEach(f => body.append("files", f));
    try { const r = await fetch("/api/request", { method: "POST", body }); const result = await r.json().catch(() => ({})) as { error?: string }; if (!r.ok) throw new Error(result.error); setStatus("Заявка принята. Инженер свяжется с вами после проверки исходных данных."); formRef.current?.reset(); }
    catch (error) { setStatus(error instanceof Error && error.message ? error.message : "Не удалось отправить заявку. Проверьте соединение или напишите нам по email."); }
  };
  return <form ref={formRef} className="request-form" onSubmit={submit} noValidate>
    <div className="form-progress" aria-label={`Шаг ${step} из 3`}><span style={{ width: `${step * 33.333}%` }}/></div>
    <div className="form-meta"><span>Шаг {step} из 3</span><b>{step === 1 ? "Постановка задачи" : step === 2 ? "Технические данные" : "Контакты и файлы"}</b></div>
    {step === 1 && <fieldset><legend>Как вы хотите поставить задачу?</legend><div className="choice-grid">{["По чертежу", "По техническому заданию", "По образцу", "По параметрам", "Нужно проектирование"].map(x => <label className={data.task === x ? "choice choice--active" : "choice"} key={x}><input type="radio" name="task" checked={data.task === x} onChange={() => update("task", x)}/><span>{x}</span><Check/></label>)}</div></fieldset>}
    {step === 2 && <fieldset><legend>Расскажите об изделии</legend><div className="fields"><label>Тип изделия<select value={data.springType} onChange={e => update("springType", e.target.value)}>{["Пружина сжатия", "Пружина растяжения", "Пружина кручения", "Клапанная пружина", "Демпферная пружина", "Стопорное кольцо", "Другое изделие"].map(x => <option key={x}>{x}</option>)}</select></label><label>Количество, шт.<input type="number" min="1" value={data.quantity} onChange={e => update("quantity", e.target.value)} placeholder="Например, 500" required/></label><label className="field-wide">Параметры и условия работы<textarea value={data.details} onChange={e => update("details", e.target.value)} placeholder="Размеры, усилия, ход, температура, ресурс…" rows={5} required/></label><label className="check field-wide"><input type="checkbox" checked={data.prototype} onChange={e => update("prototype", e.target.checked)}/><span>Нужна опытная партия перед серийным выпуском</span></label></div></fieldset>}
    {step === 3 && <fieldset><legend>Куда направить расчёт?</legend><div className="fields"><label>Имя *<input value={data.name} onChange={e => update("name", e.target.value)} required/></label><label>Компания<input value={data.company} onChange={e => update("company", e.target.value)}/></label><label>Email *<input type="email" value={data.email} onChange={e => update("email", e.target.value)} required/></label><label>Телефон<input type="tel" value={data.phone} onChange={e => update("phone", e.target.value)}/></label><label className="upload field-wide"><FileUp/><span><b>Приложить чертёж или ТЗ</b><small>PDF, DWG, DXF, STEP, DOCX, XLSX, ZIP — до 20 МБ</small></span><input type="file" multiple accept=".pdf,.dwg,.dxf,.step,.stp,.doc,.docx,.xls,.xlsx,.zip" onChange={e => setFiles(Array.from(e.target.files || []))}/></label>{files.length > 0 && <p className="file-list field-wide">Выбрано файлов: {files.length}</p>}<label className="check field-wide"><input type="checkbox" checked={data.consent} onChange={e => update("consent", e.target.checked)} required/><span>Согласен на обработку персональных данных *</span></label></div></fieldset>}
    <p className="form-status" aria-live="polite">{status}</p>
    <div className="form-nav">{step > 1 && <button type="button" className="button button--ghost" onClick={() => setStep(s => s - 1)}>Назад</button>} {step < 3 ? <button type="button" className="button" onClick={next}>Продолжить <ArrowRight/></button> : <button className="button" type="submit">Отправить на расчёт <ArrowRight/></button>}</div>
  </form>;
}

export function MobileBar() { return <div className="mobile-bar"><a href="#request"><FileUp/>Отправить чертёж</a>{company.phoneHref ? <a href={`tel:${company.phoneHref}`}><Phone/>Позвонить</a> : <a href={`mailto:${company.email}`}><Phone/>Написать</a>}</div>; }
