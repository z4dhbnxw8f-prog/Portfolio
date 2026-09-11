import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Database,
  Download,
  Mail,
  MapPin,
  Menu,
  PanelsTopLeft,
  Phone,
  ServerCog,
  ShieldCheck,
  Terminal,
  PencilRuler,
  Wrench,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { ContactForm } from '@/components/contact-form';
import { buttonVariants } from '@/components/ui/button';
import { projects } from '@/lib/projects';

const skillGroups = [
  { title: 'Frontend', icon: PanelsTopLeft, skills: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Flexbox', 'CSS Grid', 'Responsive Design', 'Tailwind CSS', 'Vite'] },
  { title: 'Backend', icon: ServerCog, skills: ['Node.js', 'Express', 'REST APIs', 'Server Actions', 'API Route Handlers'] },
  { title: 'Databases', icon: Database, skills: ['PostgreSQL', 'Prisma ORM', 'Firebase', 'Firestore', 'MongoDB', 'MongoDB Atlas'] },
  { title: 'Authentication & Security', icon: ShieldCheck, skills: ['Authentication', 'Authorization', 'Session Management', 'bcrypt', 'HTTP-only Cookies', 'Protected Routes', 'Ownership Checks', 'Firestore Security Rules'] },
  { title: 'UI/UX', icon: PencilRuler, skills: ['Figma', 'UI Design', 'UX Design', 'Wireframes', 'Prototypes', 'User Flows', 'Personas', 'Empathy Maps', 'Sitemaps', 'Information Architecture', 'Responsive Interface Design'] },
  { title: 'Tools', icon: Wrench, skills: ['Git', 'GitHub', 'VS Code', 'npm', 'Docker', 'Vercel', 'ngrok'] },
  { title: 'Development Practices', icon: Terminal, skills: ['CRUD', 'API Integration', 'Database Design', 'Debugging', 'Requirements Analysis', 'Technical Documentation', 'Scrum', 'Agile Development'] },
];

const processSteps = [
  ['01', 'Understand', 'User needs & business context'],
  ['02', 'Design', 'Flows, wireframes & interface'],
  ['03', 'Develop', 'Frontend, data & authentication'],
  ['04', 'Deliver', 'Testing, iteration & deployment'],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Yasser Akanni home">
          <span>YA</span>
          <span className="wordmark-name">Yasser Akanni</span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#top">Home</a>
          <a href="#about">About</a>
          <a href="#work">Projects</a>
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="availability" href="mailto:ressay93@outlook.com">
          <span aria-hidden="true" /> Open to junior roles
        </a>
        <details className="mobile-nav">
          <summary aria-label="Open navigation"><Menu aria-hidden="true" /> Menu</summary>
          <nav className="mobile-nav-panel" aria-label="Mobile navigation">
            <a href="#top">Home</a>
            <a href="#about">About</a>
            <a href="#work">Projects</a>
            <a href="#skills">Skills</a>
            <a href="#experience">Experience</a>
            <a href="#contact">Contact</a>
            <a className="mobile-availability" href="mailto:ressay93@outlook.com"><span aria-hidden="true" /> Open to junior roles</a>
          </nav>
        </details>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><MapPin size={14} /> Essen, Germany</div>
          <p className="role-line">Junior Frontend / Full-Stack Web Developer · UI/UX Designer</p>
          <h1>Interfaces with intent.<br /><em>Systems that work.</em></h1>
          <p className="hero-lead">
            I build responsive web applications with React and Next.js, combining frontend development, UI/UX thinking and practical full-stack experience.
          </p>
          <div className="hero-actions">
            <a className={buttonVariants({ size: 'lg' })} href="#work">View projects <ArrowDownRight /></a>
            <a className={buttonVariants({ variant: 'outline', size: 'lg' })} href="/Yasser-Akanni-CV.pdf" download>Download CV <Download /></a>
          </div>
          <div className="social-links">
            <a href="https://github.com/z4dhbnxw8f-prog" target="_blank" rel="noreferrer"><Code2 /> GitHub</a>
            <a href="https://linkedin.com/in/YasserAkanni" target="_blank" rel="noreferrer"><BriefcaseBusiness /> LinkedIn</a>
            <a href="/Yasser-Akanni-CV.pdf" download><Download /> Download CV</a>
          </div>
        </div>

        <aside className="practice-map" aria-label="Yasser's development practice">
          <div className="map-header"><span>How I build</span><span>01-04</span></div>
          <ol>
            {processSteps.map(([number, title, detail]) => (
              <li key={number}><span>{number}</span><div><strong>{title}</strong><small>{detail}</small></div></li>
            ))}
          </ol>
          <div className="map-footer"><span>Primary focus</span><strong>Frontend development</strong></div>
        </aside>
      </section>

      <section className="section projects-section" id="work">
        <div className="section-heading">
          <p className="section-kicker">Selected work</p>
          <h2>Full-stack thinking.<br />Frontend craft.</h2>
          <p>Three focused projects showing full-stack depth, real-time React development and a real-world business experience.</p>
        </div>

        <div className="project-list">
          {projects.map((project, index) => (
            <article className="project-card" key={project.slug}>
              <div className="project-number">{String(index + 1).padStart(2, '0')}</div>
              <div className="project-copy">
                <div className="project-meta"><span>{project.kicker}</span><span>{project.status}</span></div>
                <h3>{project.name}</h3>
                <p>{project.summary}</p>
                <ul className="tech-list" aria-label={`${project.name} technologies`}>
                  {project.technologies.slice(0, 6).map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
                <div className="project-links">
                  <Link className={buttonVariants({ variant: 'outline' })} href={`/projects/${project.slug}`}>View case study <ArrowRight /></Link>
                  {project.links.slice(0, 2).map((link) => (
                    <a className="text-link" href={link.url} target="_blank" rel="noreferrer" key={link.label}>{link.label} <ArrowUpRight /></a>
                  ))}
                </div>
              </div>
              <Link className="project-preview" href={`/projects/${project.slug}`} aria-label={`View ${project.name} case study`}>
                <Image src={project.image} alt={project.imageAlt} width={1440} height={900} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section about-section" id="about">
        <div className="about-title">
          <p className="section-kicker">About</p>
          <h2>A career change,<br /><em>not a blank slate.</em></h2>
        </div>
        <div className="about-copy">
          <p className="about-lead">Before moving into technology, I worked in purchasing management, international procurement and logistics operations. That experience still shapes how I work today.</p>
          <p>I understand responsibility, coordination and the practical side of business processes. I am used to working with different people, solving problems under pressure and following work through reliably.</p>
          <p>At Syntax Institut, I turned a long-standing interest in technology and digital design into structured, project-based training. My focus is frontend development, supported by UI/UX, backend fundamentals, databases, authentication and deployment.</p>
          <div className="about-principle"><ShieldCheck /><p><strong>My perspective</strong><br />Understand the user problem, shape the interface, build the solution and connect it to the systems behind it.</p></div>
          <div className="strengths" aria-label="Personal strengths">
            {['Problem solving', 'Calm communication', 'Dependable delivery', 'Team collaboration', 'Structured thinking', 'Ownership', 'Consistency', 'Willingness to learn'].map((strength) => <span key={strength}>{strength}</span>)}
          </div>
        </div>
      </section>

      <section className="section skills-section" id="skills">
        <div className="section-heading compact">
          <p className="section-kicker">Technical skills</p>
          <h2>Tools I use to move from idea to working product.</h2>
          <p>Practical and project-based experience across the web application lifecycle.</p>
        </div>
        <div className="skills-grid">
          {skillGroups.map(({ title, icon: Icon, skills }) => (
            <article className="skill-group" key={title}>
              <div className="skill-title"><Icon /><h3>{title}</h3></div>
              <p>{skills.join(' · ')}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section experience-section" id="experience">
        <div className="experience-heading">
          <p className="section-kicker">Experience & training</p>
          <h2>Technical direction.<br /><em>Professional discipline.</em></h2>
          <p>The portfolio projects show my current development practice. My earlier roles add experience in responsibility, process awareness, coordination and teamwork.</p>
        </div>
        <div className="timeline">
          <article className="timeline-item featured">
            <div className="timeline-date">15.09.2025 - 14.09.2026</div>
            <div><p className="timeline-kind">IT qualification · 2,300 UE</p><h3>Qualifizierung zur IT-Fachkraft</h3><p className="timeline-org">Syntax Institut</p><p>Project-based training in product design, UI/UX, software and web development, frontend development, backend fundamentals, databases, authentication, APIs, Git/GitHub, deployment, agile work and technical documentation.</p>
              <ul className="module-list"><li><span>700 UE</span> Product design & IT product development</li><li><span>600 UE</span> Software & web development introduction</li><li><span>500 UE</span> Frontend development focus</li><li><span>500 UE</span> Specialization & career preparation</li></ul>
            </div>
          </article>
          <article className="timeline-item"><div className="timeline-date">2023 - 2025</div><div><p className="timeline-kind">Logistics Operations Associate</p><h3>Preymesser</h3><p>Supported warehouse and transport operations through loading, offloading and material handling, working closely with operational teams to maintain safe and reliable workflows.</p></div></article>
          <article className="timeline-item"><div className="timeline-date">2022 - 2023</div><div><p className="timeline-kind">Industrial Logistics Operator</p><h3>Haeger &amp; Schmidt</h3><p>Performed truck and vessel loading and offloading, crane-assisted material handling, blade cutting and work-area maintenance within a safety-focused industrial environment.</p></div></article>
          <article className="timeline-item"><div className="timeline-date">2007 - 2021</div><div><p className="timeline-kind">Purchasing Manager · International Procurement & SAP</p><h3>SIB Enterprises</h3><p>Managed purchasing and procurement operations, including international travel for supplier sourcing and business coordination. Used SAP to manage purchasing workflows, orders, supplier records and procurement administration, while coordinating import and export activities.</p></div></article>
        </div>
      </section>

      <section className="section language-section" aria-labelledby="languages-title">
        <p className="section-kicker">Languages</p>
        <h2 id="languages-title">English <span>Fluent</span> · French <span>Fluent</span> · German <span>Currently developing</span></h2>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="section-kicker">Contact</p>
          <h2>Let&apos;s build something useful.</h2>
          <p>I&apos;m open to junior frontend, React, Next.js and web-development opportunities in Essen, the Ruhrgebiet and across NRW.</p>
          <address>
            <a href="mailto:ressay93@outlook.com"><Mail /> ressay93@outlook.com</a>
            <a href="tel:+4917612854755"><Phone /> +49 176 12854755</a>
            <span><MapPin /> Essen, Germany</span>
          </address>
        </div>
        <ContactForm />
      </section>

      <footer>
        <div><strong>Yasser Akanni</strong><span>Junior Frontend / Full-Stack Web Developer</span></div>
        <div className="footer-links"><a href="https://github.com/z4dhbnxw8f-prog" target="_blank" rel="noreferrer">GitHub <ArrowUpRight /></a><a href="https://linkedin.com/in/YasserAkanni" target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight /></a><a href="#top">Back to top <ArrowUpRight /></a></div>
      </footer>
    </main>
  );
}
