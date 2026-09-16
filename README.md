# Yasser Akanni portfolio

Bilingual English/German portfolio, project case studies, downloadable CVs and certificates, and a Formspree contact form. Built with React, TypeScript, and Vinext using Next.js App Router conventions.

## Development

Requires Node.js 22.13 or newer.

```sh
npm ci
npm run dev
```

Use the local URL printed by the development server. English is the default; `?lang=de` selects German.

## Checks and build

```sh
npm run lint
npm run typecheck
npm run build
```

The default build uses the Cloudflare/Sites configuration in `vite.config.ts`; `npm start` serves that build through Wrangler. Vercel uses the separate `vite.vercel.config.ts` and `vercel.json` configuration. Building does not publish the site.

## Content

- `lib/portfolio-content.ts`: bilingual copy, experience, skills, and qualifications.
- `lib/projects.ts`: project details, images, and live/source links.
- `app/projects/[slug]/page.tsx`: project case studies.
- `public/`: downloadable CVs, certificates, fonts, and images.
- `scripts/build_public_documents.py`: document-generation entry point; review its Python dependencies before running.
- `components/contact-form.tsx`: Formspree form `xaeykgjq`; sending messages requires the corresponding active Formspree form. No application database is used.

The `/certificates` route redirects to the homepage qualifications section and preserves the selected language. The two IHK qualifications marked pending need their issued certificates before download links can be added.

Keep secrets in ignored `.env*` files. Do not commit credentials.
