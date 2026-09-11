import Link from 'next/link';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';

const certificates = [
  {
    title: 'Produktdesign & -entwicklung in der IT',
    fileName: 'Yasser_Akanni_Produktdesign & -entwicklung in der IT.pdf',
    meta: 'Syntax Institut · 2025–2026 · 2.300 UE',
    detail: 'Foundation course covering product design, UX thinking and IT product development.',
  },
  {
    title: 'Einführung Software- und Webentwicklung',
    fileName: '02.04.2026_Yasser_Akanni_Einführung Software- und Webentwicklung.pdf',
    meta: 'Syntax Institut · 2026',
    detail: 'Completed the software and web development introduction module.',
  },
  {
    title: 'Vertiefung Frontend Entwicklung',
    fileName: '25.06.2026_Yasser_Akanni_Vertiefung_ Frontend Entwicklung.pdf',
    meta: 'Syntax Institut · 2026',
    detail: 'Completed the advanced frontend development module.',
  },
  {
    title: 'Seminar Certificate',
    fileName: 'Zertifikat_fuer_Seminar_F-78-000-26-294.pdf',
    meta: 'Syntax Institut · 2026',
    detail: 'Completed the seminar certificate for the specified training session.',
  },
];

export default function CertificatesPage() {
  return (
    <main>
      <section className="section certificates-section">
        <div className="section-heading compact">
          <p className="section-kicker">Certificates</p>
          <h2>All of my certificates</h2>
        </div>

        <div className="certificate-actions">
          <Link className={buttonVariants({ variant: 'outline' })} href="/">
            <ArrowLeft /> Back home
          </Link>
        </div>

        <div className="certificate-list">
          {certificates.map((certificate) => (
            <article className="certificate-card" key={certificate.fileName}>
              <div className="certificate-header">
                <div className="certificate-badge">✓</div>
                <div>
                  <p className="certificate-kind">Certificate</p>
                  <h3>{certificate.title}</h3>
                </div>
              </div>

              <div className="certificate-meta">
                <span>{certificate.meta}</span>
              </div>

              <p>{certificate.detail}</p>

              <div className="project-links">
                <a
                  className={buttonVariants({ size: 'sm' })}
                  href={`/certificates/${encodeURIComponent(certificate.fileName)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open certificate <ArrowUpRight />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
