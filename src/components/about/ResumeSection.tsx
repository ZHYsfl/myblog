import { useLang } from '@/lib/useLang';
import { copy } from '@/components/about/resume-copy';

export function ResumeSection() {
  const [lang] = useLang();
  const t = copy[lang];

  return (
    <section className="mb-20">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-4 border-b border-border pb-4">
        <h2 className="font-serif text-2xl font-semibold text-fg">{t.label}</h2>
        <a
          href="/CV/个人简历.pdf"
          target="_blank"
          rel="noopener noreferrer"
          download
          className="text-sm font-medium text-accent transition-colors hover:underline"
        >
          {t.download}
        </a>
      </div>

      {/* magazine photo grid */}
      <div className="mx-auto mb-14 grid max-w-4xl grid-cols-12 gap-4 sm:gap-6">
        <div className="col-span-12 aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src="/images/about/photo0.jpg"
            alt="Haoyang Zhou"
            className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="col-span-6 aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src="/images/about/photo3.jpg"
            alt="Haoyang Zhou"
            className="h-full w-full object-cover object-[50%_62%] transition-transform duration-700 hover:scale-105"
          />
        </div>
        <div className="col-span-6 aspect-[4/3] overflow-hidden rounded-2xl">
          <img
            src="/images/about/photo2.jpg"
            alt="Haoyang Zhou"
            className="h-full w-full object-cover object-[50%_45%] transition-transform duration-700 hover:scale-105"
          />
        </div>
      </div>

      <div className="space-y-16">
        {/* education */}
        <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.education.title}</h3>
          <div className="space-y-2 leading-relaxed text-muted">
            <p className="text-fg">{t.education.school}</p>
            <p className="text-fg">{t.education.school2}</p>
            <p>{t.education.gpa}</p>
            <p>{t.education.math}</p>
            <p>{t.education.cs}</p>
            <p>{t.education.summary}</p>
          </div>
        </div>

        {/* research timeline */}
        <div>
          <h3 className="mb-6 font-serif text-xl font-semibold text-fg">{t.research.title}</h3>
          <div className="relative space-y-10 border-l border-border pl-6">
            {t.research.items.map((item, i) => (
              <div key={i} className="relative">
                <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent ring-4 ring-bg"></span>
                {item.title && (
                  <p className="mb-1 font-medium text-fg">
                    {item.title}
                    {'link' in item && item.link && (
                      <a
                        href={item.link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 text-xs font-normal text-accent hover:underline"
                      >
                        {item.link.label} ↗
                      </a>
                    )}
                  </p>
                )}
                <p className="mb-1 text-sm font-medium text-accent">{item.date}</p>
                {item.sub && <p className="mb-2 text-sm italic text-muted">{item.sub}</p>}
                <p
                  className="leading-relaxed text-muted"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* honors / skills / traits / contact */}
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div className="space-y-10">
            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.honors.title}</h3>
              <ul className="space-y-3 text-muted">
                {t.honors.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.traits.title}</h3>
              <ul className="space-y-3 text-muted">
                {t.traits.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.skills.title}</h3>
              <ul className="space-y-3 text-muted">
                {t.skills.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-serif text-xl font-semibold text-fg">{t.contact.title}</h3>
              <ul className="space-y-2 text-muted">
                {t.contact.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
