export type ProjectLink = {
  kind: 'live' | 'source';
  url: string;
};

export type Project = {
  slug: string;
  name: string;
  kicker: string;
  type: string;
  status: string;
  image: string;
  imageAlt: string;
  summary: string;
  technologies: string[];
  problem: string;
  goal: string;
  role: string;
  ux: string;
  architecture: string;
  features: string[];
  challenges: string;
  solutions: string;
  learnings: string;
  result: string;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: 'penee',
    name: 'Penee',
    kicker: 'Final Course Project',
    type: 'Full-Stack Expense Tracker',
    status: 'Live',
    image: '/projects/penee-demo.png',
    imageAlt: 'Penee personal finance application secure login screen',
    summary: 'A full-stack personal finance application for managing accounts, transactions, budgets and multiple currencies, with session-based authentication and safeguards designed to preserve historical financial data.',
    technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Server Actions', 'API Route Handlers', 'Vercel'],
    problem: 'Personal finance software has to make everyday money management understandable while protecting the integrity of completed financial records across accounts and currencies.',
    goal: 'Build one application for accounts, transactions, budgets, currencies, a dashboard, a ledger and statements, supported by authentication and ownership checks.',
    role: 'I designed and developed the application across the responsive interface, server-side logic, database layer, authentication flow and deployment.',
    ux: 'The interface brings summaries and day-to-day actions together through a dashboard, then gives users more detailed views through the ledger and statements. Corrections are treated as part of the financial story rather than hidden edits.',
    architecture: 'A React interface runs in Next.js. Server Actions and API route handlers coordinate application logic, Prisma maps the data layer, PostgreSQL stores records, and session-based authentication protects user data while preserving the historical integrity of completed financial records.',
    features: ['Registration, login and logout', 'Accounts, income, expenses and transactions', 'Budgets, currencies and exchange rates', 'Dashboard, ledger and statements', 'Session management and protected data', 'Ownership checks and correction transactions'],
    challenges: 'Financial values and history require more care than ordinary content. Currency preferences can change, but historical transactions must retain their original amount, currency, transaction-date exchange rate and historical converted value.',
    solutions: 'Money is represented with Decimal rather than Float. Completed history is corrected through new correction transactions, and base-currency changes recalculate current totals without rewriting historical records.',
    learnings: 'Penee strengthened my ability to connect interface decisions with server-side logic, relational data, authentication, authorization and deployment.',
    result: 'A deployed full-stack finance application that demonstrates the complete flow from responsive UI to financial business rules, session-based security and data-integrity safeguards.',
    links: [
      { kind: 'live', url: 'https://xpense-trvcker.vercel.app' },
      { kind: 'source', url: 'https://github.com/z4dhbnxw8f-prog/expense-tracker' },
    ],
  },
  {
    slug: 'itemvault',
    name: 'ItemVault',
    kicker: 'Real-time application',
    type: 'React / Firebase Web Application',
    status: 'Live',
    image: '/projects/itemvault-demo.png',
    imageAlt: 'ItemVault responsive personal inventory landing page',
    summary: 'A responsive personal inventory application with Firebase authentication, real-time Firestore data and user-focused organization tools.',
    technologies: ['React', 'Vite', 'Firebase Authentication', 'Firestore', 'Responsive Design'],
    problem: 'Personal inventories become difficult to use when items cannot be found quickly or when private records are not clearly separated by user.',
    goal: 'Create a secure inventory workflow that lets each signed-in user organize and find their own items across screen sizes.',
    role: 'I built the React interface, authentication flow, real-time data integration, protected routes and responsive inventory experience.',
    ux: 'The interface supports desktop, tablet and mobile use. Search, filters, categories, locations and item status reduce the effort required to scan an inventory.',
    architecture: 'A React application built with Vite uses Firebase Authentication for access and Firestore for data. Real-time listeners keep the interface synchronized, while protected routes and Firestore security rules guard private records.',
    features: ['Registration and login', 'Private user inventories', 'Item creation', 'Categories, locations and item status', 'Search and filtering', 'Dashboard and responsive layouts'],
    challenges: 'The central challenges were real-time synchronization, user data security, responsive design and shaping a useful inventory workflow.',
    solutions: 'Firestore listeners keep item data current. Authentication, protected routes and Firestore security rules work together to separate each user’s inventory.',
    learnings: 'ItemVault improved my practical understanding of client-side application structure, Firebase authentication, live cloud data and responsive interface decisions.',
    result: 'A deployed inventory application that presents a distinct React and Firebase skill set alongside the full-stack depth of Penee.',
    links: [
      { kind: 'live', url: 'https://item-vault.vercel.app' },
      { kind: 'source', url: 'https://github.com/z4dhbnxw8f-prog/Itemvault' },
    ],
  },
  {
    slug: 'cosmic-styles',
    name: 'Cosmic Styles LLC',
    kicker: 'Freelance client project',
    type: 'Freelance Client Project',
    status: 'Live',
    image: '/projects/screens/cosmic-current.png',
    imageAlt: 'Cosmic Styles LLC responsive barbershop website',
    summary: 'A responsive barbershop website designed and built as a freelance project for Cosmic Styles LLC, presenting real services and business information through a structured appointment request.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design', 'Vercel'],
    problem: 'A local barbershop needs to communicate its identity, services, pricing, location and availability while giving customers a clear path to request an appointment.',
    goal: 'Create a focused business website that moves naturally from service discovery and gallery content into a simple booking and contact flow.',
    role: 'I designed and built the responsive interface and multi-step booking experience, connected customer requests to WhatsApp and the customer’s email app.',
    ux: 'The booking journey follows three clear steps: choose a service, choose a date and time, then provide customer details. The interface combines cream, dark brown, gold and green, real imagery and responsive layouts.',
    architecture: 'The core site is dependency-free HTML, CSS and JavaScript. Booking availability and interface state run in the browser. Requests open a prefilled WhatsApp message or email draft for the customer to send. The shop confirms the appointment directly.',
    features: ['Service and price presentation', 'Business location and booking hours', 'Responsive gallery and navigation', 'Service, date and time selection', 'Customer-detail collection', 'WhatsApp booking handoff', 'Prefilled email request'],
    challenges: 'The main challenge was turning several practical business requirements into one clear mobile and desktop journey without introducing an unnecessarily heavy booking platform.',
    solutions: 'The information architecture separates services, studio details, gallery content and booking. The scheduler progressively reveals the next decision and prepares a detailed WhatsApp request for confirmation by the shop.',
    learnings: 'Cosmic Styles strengthened my ability to translate real business information into a branded interface, responsive user journey and practical contact workflow.',
    result: 'A deployed business website that lets visitors understand the service offering and prepare an appointment request without claiming persistence or automatic confirmation.',
    links: [
      { kind: 'live', url: 'https://cosmicstylesllc.vercel.app' },
      { kind: 'source', url: 'https://github.com/z4dhbnxw8f-prog/cosmos-barbershop' },
    ],
  },
  {
    slug: 'salesbook',
    name: 'Salesbook',
    kicker: 'Business application',
    type: 'Full-Stack Sales & Stock Management',
    status: 'Live',
    image: '/projects/screens/salesbook-dashboard-redacted.png',
    imageAlt: 'Salesbook dashboard with sales totals, stock and a sales trend chart',
    summary: 'A business application for tracking sales, stock, payments, employee commissions and cash handovers in a configurable currency, with separate owner and worker access.',
    technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind CSS', 'Vercel'],
    problem: 'Shop owners need to reconcile sales, remaining stock and money held by employees without giving every worker access to owner controls.',
    goal: 'Bring stock, sales, payments, commissions and worker handovers into one protected workspace.',
    role: 'I developed the responsive workspace, database models, authentication and server-side sales and stock workflows.',
    ux: 'A compact green interface groups everyday sales and stock actions, with separate controls for owners and workers.',
    architecture: 'Next.js and React provide the interface. Server-side operations use Prisma and PostgreSQL for shop records, sales, stock and payments, with role and ownership checks.',
    features: ['Separate owner and worker access', 'Sales and remaining stock tracking', 'Payments and cash handovers', 'Commission recorded per sale', 'Configurable workspace currency', 'Dashboard summaries and CSV export'],
    challenges: 'Stock, payments and commissions must remain consistent while workers have restricted access to business records.',
    solutions: 'Server-side permissions protect owner operations. Transactional sales updates record the sale and reduce stock together, while each sale retains its commission rate and amount.',
    learnings: 'The project connects relational data, transactional operations, role-based access and practical business workflows.',
    result: 'A deployed sales and stock application with authenticated workspaces for owners and workers.',
    links: [{ kind: 'live', url: 'https://salesbook-bay.vercel.app' }],
  },
  {
    slug: 'learn-yoruba',
    name: 'Learn Yoruba with Ykay',
    kicker: 'Language & culture website',
    type: 'Language Learning & Tutor Website',
    status: 'Live',
    image: '/projects/screens/learn-yoruba.png',
    imageAlt: 'Learn Yoruba with Ykay homepage introducing Yoruba lessons and culture',
    summary: 'A responsive teaching website that introduces Ykay, Yoruba lessons and cultural stories, with direct email and WhatsApp contact for lesson enquiries.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Motion', 'Vercel'],
    problem: 'Prospective learners need to understand the tutor, available lessons and cultural context before making a lesson enquiry.',
    goal: 'Connect tutor information, learning options and Yoruba culture through a welcoming website with clear contact actions.',
    role: 'I built the responsive pages, navigation, culture content presentation and direct contact flows.',
    ux: 'Warm colours, tutor imagery and clear lesson choices guide visitors from discovery to contacting Ykay.',
    architecture: 'Next.js, React and TypeScript render the pages. Tailwind CSS styles the interface, Motion supports animation, and email and WhatsApp links support direct enquiries.',
    features: ['Tutor introduction', 'Lesson information and learning options', 'Yoruba culture and stories', 'Responsive navigation', 'Direct email and WhatsApp enquiries', 'Motion and reduced-motion support'],
    challenges: 'Language learning and cultural content need a coherent presentation that remains readable and easy to navigate on mobile.',
    solutions: 'Shared navigation and consistent page layouts connect tutor, lesson and culture content, with direct contact actions throughout the journey.',
    learnings: 'The project strengthened my approach to content-led interfaces, responsive navigation and accessible motion.',
    result: 'A deployed tutor and culture website that helps visitors explore Yoruba learning and contact Ykay directly.',
    links: [{ kind: 'live', url: 'https://learnyorubawithykay.vercel.app' }],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
