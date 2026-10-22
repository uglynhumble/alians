import { ArrowDown, ArrowRight, Atom, Boxes, CircleGauge, ClipboardCheck, Cog, DraftingCompass, Factory, FlaskConical, Gauge, Layers3, Microscope, PackageCheck, ShieldCheck, Sparkles, TestTubeDiagonal, Wrench } from "lucide-react";
import Image from "next/image";
import { company, gallery, productPhotos, products, stages, taskTypes } from "./content";
import { Faq, Header, MobileBar, ProductGraphic, RequestForm } from "./components";

const capabilities = [
  [Factory, "Собственное производство", "Полный маршрут — от навивки и термообработки до финишной проверки."],
  [Cog, "15 единиц оборудования", "Пружинно-навивочное оборудование для опытных и серийных партий."],
  [FlaskConical, "Собственная лаборатория", "Измерение геометрических и силовых характеристик изделий."],
  [DraftingCompass, "Инженерный центр", "Расчёт, проектирование и проверка технологичности конструкции."],
] as const;

export default function Home() {
  const jsonLd = { "@context": "https://schema.org", "@type": "Organization", name: company.legalName, url: process.env.NEXT_PUBLIC_SITE_URL || "https://springs-alians.com", email: company.email, telephone: company.phoneLabel, address: company.address, description: "Производство промышленных пружин и изделий из проволоки" };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
    <Header/>
    <main id="top">
      <section className="hero">
        <div className="hero-grid" aria-hidden="true"/><div className="hero-orbit hero-orbit--one" aria-hidden="true"/><div className="hero-orbit hero-orbit--two" aria-hidden="true"/>
        <div className="container hero__inner">
          <div className="hero__copy">
            <p className="eyebrow"><span/>Инженерное производство полного цикла</p>
            <h1>Промышленные пружины <em>по чертежам, образцам и ТЗ</em></h1>
            <p className="hero__lead">Проектируем и производим опытные и серийные партии для машиностроения и промышленного оборудования.</p>
            <div className="hero__buttons"><a className="button button--light" href="#request">Отправить чертёж на расчёт <ArrowRight/></a><a className="button button--outline" href="#engineering">Консультация инженера</a></div>
            <p className="hero__note"><ShieldCheck/>Документация обрабатывается конфиденциально</p>
          </div>
          <div className="hero__visual" aria-label="Техническая визуализация пружины">
            <Image className="hero-photo" src="/images/hero-production-v2.png" alt="Производственный цех с оборудованием для изготовления пружин" fill priority sizes="(max-width: 800px) 100vw, 45vw"/>
            <div className="measure measure--b"><small>КОНТРОЛЬ</small><b>Геометрия + усилие</b></div>
            <div className="hero__stamp"><strong>ОТ ИДЕИ</strong><span>ДО СЕРИИ</span></div>
          </div>
          <a href="#metrics" className="scroll-cue" aria-label="Прокрутить к показателям"><ArrowDown/></a>
        </div>
      </section>

      <section className="metrics" id="metrics"><div className="container metrics__grid">
        <div><strong>15</strong><span>единиц пружинно-<br/>навивочного оборудования</span></div><div><strong>1,8–120</strong><span>мм — наружный диаметр<br/>пружин сжатия</span></div><div><strong>3</strong><span>способа постановки задачи:<br/>КД, образец или параметры</span></div><div><strong>СТАНДАРТЫ</strong><span>IATF 16949:2016 и ISO 9001:2015 -<br/>заявленные стандарты</span></div>
      </div><p className="container metrics__disclaimer">Характеристики и стандарты перенесены с действующего сайта springs-alians.com.</p></section>

      <section className="section task-section"><div className="container"><div className="section-head"><div><p className="eyebrow eyebrow--dark"><span/>Начните с того, что у вас есть</p><h2>Как можно поставить задачу</h2></div><p>Не обязательно готовить полный комплект документации. Инженер поможет восстановить недостающие параметры.</p></div><div className="task-grid">{taskTypes.map(([n, title, text]) => <a href="#request" className="task-card" key={n}><span>{n}</span><DraftingCompass/><h3>{title}</h3><p>{text}</p><b>Выбрать <ArrowRight/></b></a>)}</div></div></section>

      <section className="section section--ink" id="products"><div className="container"><div className="section-head section-head--light"><div><p className="eyebrow"><span/>Продукция</p><h2>Пружины и изделия<br/>из проволоки</h2></div><p>Изготавливаем стандартные и нестандартные изделия под рабочие нагрузки вашего узла.</p></div><div className="product-grid">{products.map(([type, title, text]) => <article className="product-card" key={type}><div className="product-card__top"><span>SA / {String(products.findIndex(p => p[0] === type) + 1).padStart(2, "0")}</span><ArrowRight/></div>{productPhotos[type] ? <div className={`product-photo${type === "extension" ? " product-photo--contain" : ""}${type === "valve" ? " product-photo--valve" : ""}${type === "torsion" ? " product-photo--torsion" : ""}`}><Image src={productPhotos[type]} alt={`${title} производства Спрингс Альянс`} fill sizes="(max-width: 800px) 100vw, 25vw" style={type === "torsion" ? { objectFit: "contain", objectPosition: "center", transform: "none" } : undefined}/>{(type === "compression" || type === "extension" || type === "torsion") && <span className="product-photo__logo" aria-hidden="true"/>}</div> : <ProductGraphic type={type}/>}<h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="section capabilities" id="capabilities"><div className="container"><div className="section-head"><div><p className="eyebrow eyebrow--dark"><span/>Производственные возможности</p><h2>От проволоки<br/>до готовой партии</h2></div><p>Единый производственный контур снижает риски на стыках между проектированием, изготовлением и контролем.</p></div><div className="cap-layout"><div className="factory-visual factory-photos"><div className="factory-label"><span>РЕАЛЬНАЯ ПРОДУКЦИЯ</span><b>СПРИНГС<br/>АЛЬЯНС</b></div>{gallery.slice(0,4).map(([src,alt],i)=><div className={`factory-photo factory-photo--${i+1}`} key={src}><Image src={src} alt={alt} fill sizes="(max-width: 800px) 50vw, 25vw"/></div>)}</div><div className="cap-list">{capabilities.map(([Icon, title, text], i) => <article key={title}><span>0{i+1}</span><Icon/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div></div><div className="source-gallery">{gallery.slice(4).map(([src,alt])=><figure key={src}><Image src={src} alt={alt} width={700} height={400}/><figcaption>{alt}</figcaption></figure>)}</div></div></section>

      <section className="critical" id="engineering"><div className="container critical__grid"><div><p className="eyebrow"><span/>Высокоответственные пружины</p><h2>Наша цель сделать<br/>надежное изделие</h2><p>Проектируем изделия для циклических и динамических нагрузок, где критичны стабильность усилия, ресурс и повторяемость параметров.</p><a className="button button--light" href="#request">Обсудить задачу с инженером <ArrowRight/></a></div><div className="critical__diagram"><div className="target"><i/><i/><i/><i/></div><ul><li><Gauge/>Расчёт силовой характеристики</li><li><Atom/>Подбор материала и технологии</li><li><TestTubeDiagonal/>Испытания опытной партии</li><li><CircleGauge/>Контроль параметров серии</li></ul></div></div></section>

      <section className="section" id="quality"><div className="container"><div className="section-head"><div><p className="eyebrow eyebrow--dark"><span/>Инженерия и качество</p><h2>Данные вместо<br/>предположений</h2></div><p>Критерии качества задаются до запуска. На каждом этапе проверяем то, что влияет на работу изделия в узле.</p></div><div className="quality-grid"><article><DraftingCompass/><span>01</span><h3>Проектирование</h3><p>Расчёт геометрии, жёсткости, напряжений и запаса по рабочим режимам.</p></article><article><Microscope/><span>02</span><h3>Лабораторный контроль</h3><p>Измерение геометрических и силовых характеристик по согласованной программе.</p></article><article><ClipboardCheck/><span>03</span><h3>Документы партии</h3><p>Паспорт качества и протокол измерений — при согласовании в заказе.</p></article></div></div></section>

      <section className="materials"><div className="container materials__grid"><div><p className="eyebrow"><span/>Материалы и обработка</p><h2>Под рабочую среду<br/>и ресурс изделия</h2><p>Подбираем материал, термообработку и защиту после анализа нагрузок и условий эксплуатации.</p></div><div className="materials__columns"><div><h3><Layers3/>Материалы</h3><ul><li>Сталь А-1, Б-1, 51ХФА и 68ГА</li><li>Нержавеющая сталь 12Х18Н10Т</li><li>Проволока EN 10270-1/2/3, DIN 1.4310</li><li>Бронзовые стали</li></ul></div><div><h3><Sparkles/>Покрытия и обработка</h3><ul><li>Порошковая окраска</li><li>Дробеструйное упрочнение</li><li>Гальваническое покрытие</li><li>Защита от коррозии</li></ul></div></div></div></section>

      <section className="section industries"><div className="container"><div className="section-head"><div><p className="eyebrow eyebrow--dark"><span/>Отрасли применения</p><h2>Работаем с промышленными предприятиями</h2></div></div><div className="industry-row">{[[Cog,"Машиностроение"],[Factory,"Промышленное оборудование"],[Wrench,"Ремонт и сервис"],[Boxes,"Производители узлов"],[PackageCheck,"Сельхозтехника"]].map(([Icon,title]) => {const I=Icon as typeof Cog; return <div key={String(title)}><I/><span>{String(title)}</span></div>})}</div></div></section>

      <section className="case"><div className="container case__grid"><div className="case__visual case__visual--photo"><Image src="/images/case-spring-testing-portrait.png" alt="Испытание промышленной пружины на лабораторном оборудовании" fill sizes="(max-width: 800px) 100vw, 50vw" style={{objectFit:"cover",objectPosition:"82% 55%",transform:"scale(1.22)"}}/><span>ИНЖЕНЕРНОЕ ПРОИЗВОДСТВО / 01</span></div><div className="case__copy"><p className="eyebrow"><span/>Пример решения</p><h2>Пружина клапана промышленного двигателя</h2><p>Проектирование под заданную геометрию узла и рабочий диапазон нагрузок с проверкой характеристик опытной партии.</p><dl><div><dt>Задача</dt><dd>Замена снятого с производства импортного изделия</dd></div><div><dt>Решение</dt><dd>Обмер, расчёт аналога, подбор материала, опытная партия</dd></div><div><dt>Контроль</dt><dd>Геометрия и силовая характеристика в рабочих точках</dd></div></dl><small>Параметры кейса публикуются после согласования с заказчиком.</small></div></div></section>

      <section className="section stages" id="stages"><div className="container"><div className="section-head"><div><p className="eyebrow eyebrow--dark"><span/>Процесс</p><h2>Семь этапов<br/>от заявки до отгрузки</h2></div><p>Прозрачный маршрут с контрольными точками — вы понимаете, что происходит с заказом на каждом этапе.</p></div><div className="stages__line">{stages.map(([n,title,text])=><article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>

      <section className="request" id="request"><div className="container request__grid"><div className="request__intro"><p className="eyebrow"><span/>Расчёт заказа</p><h2>Передайте задачу инженеру</h2><p>Приложите чертёж, ТЗ или опишите изделие. Мы проверим исходные данные и уточним, что потребуется для расчёта.</p><ul><li><ShieldCheck/>Конфиденциальная обработка КД</li><li><DraftingCompass/>Проверка технологичности</li><li><ArrowRight/>Ответ с понятным следующим шагом</li></ul></div><RequestForm/></div></section>

      <section className="section faq" id="faq"><div className="container faq__grid"><div><p className="eyebrow eyebrow--dark"><span/>FAQ</p><h2>Частые вопросы</h2><p>Не нашли ответа? Опишите задачу — инженер подскажет, какие данные нужны для старта.</p><a href="#request" className="text-link">Задать вопрос инженеру <ArrowRight/></a></div><Faq/></div></section>

      <section className="contacts" id="contacts"><div className="container contacts__grid"><div><p className="eyebrow"><span/>Контакты</p><h2>Обсудим вашу<br/>производственную задачу</h2><p className="contacts__legal">Заказы и реализация продукции — {company.salesCompany}</p></div><div className="contacts__cards"><div><small>ОТДЕЛ ПРОДАЖ</small><a href={`tel:${company.phoneSecondaryHref}`}>{company.phoneSecondaryLabel}</a><a href={`tel:${company.mobilePhoneHref}`}>{company.mobilePhoneLabel}</a><a href={`mailto:${company.email}`}>{company.email}</a></div><div><small>ПРОИЗВОДСТВЕННАЯ ПЛОЩАДКА</small><b>{company.address}</b></div></div></div></section>
    </main>
    <footer><div className="container footer__grid"><div className="brand brand--light"><span className="source-logo"/><span><b>{company.name}</b><small>{company.descriptor}</small></span></div><p>© {new Date().getFullYear()} {company.legalName}. Информация на сайте не является публичной офертой.</p><div><a href="mailto:sale@springs-alians.ru">Написать нам</a><a href="#top">Наверх ↑</a></div></div></footer>
    <MobileBar/>
  </>;
}
