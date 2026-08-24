# Rise Behavior Therapy — Website

Modern marketing site for [Rise Behavior Therapy](https://risebehaviortherapy.com), an ABA
practice in Miami Lakes, Florida. Built with **Astro 7** and **Tailwind CSS 4**, output as a
fully static site (no server required).

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in ./dist
npm run preview  # serve the production build locally
```

Node 20+ required.

---

## Editing content — start here

**Almost everything you'll want to change lives in one file: [`src/data/site.ts`](src/data/site.ts).**

| What you want to change | Where |
| --- | --- |
| Phone, fax, email, address, hours | `contact` |
| Social media links (currently empty — links hide until filled in) | `contact.social` |
| Founder names, titles, bios | `founders` |
| Ages served, service area | `facts` |
| The five services and their bullet points | `services` |
| Center / in-home / school descriptions | `settings` |
| The 4-step "getting started" process | `steps` |
| Insurance plan list | `insurances` |
| FAQ questions and answers | `faqs` |
| Open job postings | `jobs` |
| Header navigation | `nav` |
| **Form delivery email** | `forms.accessKey` — see below |

Changing a value there updates it everywhere on the site, including the structured data
Google reads.

---

## Making the forms deliver email

The consultation and careers forms are wired but **not yet connected to an inbox**. Until they
are, submitting a form opens the visitor's email app with the details pre-filled — so nothing
is ever lost, but it is not ideal.

To turn on real delivery (2 minutes, free):

1. Go to <https://web3forms.com>, enter `Info@risebehaviortherapy.com`, and get an access key.
2. Paste it into `forms.accessKey` in `src/data/site.ts`.
3. Commit and push. Submissions now arrive by email automatically.

Both forms deliberately ask visitors not to submit medical details — this is a marketing site,
not a HIPAA-covered intake channel. Clinical information should be collected by phone or through
a secure intake system.

---

## Deploying

The site is static, so it runs anywhere. The recommended setup is **Vercel**, with the domain
staying registered at GoDaddy.

### First deploy

1. Push this repo to GitHub.
2. At <https://vercel.com>, **Add New → Project**, import the repo. Vercel auto-detects Astro;
   no configuration needed (`vercel.json` is already here).
3. Deploy. You get a preview URL like `rise-behavior-therapy.vercel.app` — share this for review
   before touching the live domain.

### Pointing risebehaviortherapy.com at it

1. In Vercel: **Project → Settings → Domains → Add** `risebehaviortherapy.com` and
   `www.risebehaviortherapy.com`. Vercel shows the exact DNS records it wants.
2. In GoDaddy: **My Products → Domain → DNS → Manage DNS**, and set the records Vercel gave you
   (typically an `A` record for `@` and a `CNAME` for `www`).
3. **Leave every `MX` record untouched** — those carry `Info@risebehaviortherapy.com`. Only the
   `A` and `CNAME` records change.
4. Propagation is usually 15–60 minutes. HTTPS is issued automatically.
5. Once live, the old GoDaddy Website Builder plan can be cancelled.

Reverting is just as easy: put the old DNS records back.

---

## Project structure

```
src/
  data/site.ts          all business content — edit this
  layouts/Base.astro    <head>, SEO meta, schema.org, header + footer
  components/           Header, Footer, LeadForm, Faq, CtaBand, PageHero, Icon
  pages/                one file per route
  styles/global.css     Tailwind theme: brand colors, type, buttons, cards
  assets/               photography (optimized at build time)
public/                 logos, favicons, og image, robots.txt
scripts/
  build-logos.py        regenerates the vector logo set from the flyer artwork
  build-og.py           regenerates the social sharing card
```

### Pages

`/` · `/about` · `/services` · `/getting-started` · `/insurance` · `/resources` ·
`/careers` · `/contact` · `/privacy` · `/accessibility` · custom `404`

---

## Brand assets

The logo was vector-traced from the company flyer, so it is resolution independent:

| File | Use |
| --- | --- |
| `public/logo-h.svg` | horizontal lockup — site header |
| `public/logo-h-white.svg` | horizontal lockup, dark backgrounds — footer |
| `public/logo.svg` / `logo-white.svg` | stacked lockup |
| `public/icon.svg` / `icon-white.svg` | icon only |
| `public/og.jpg` | social preview card (1200×630) |

Brand colors are defined once in `src/styles/global.css`: navy `#12275B`, leaf green `#12813C`.

---

## SEO & accessibility

- `LocalBusiness` / `MedicalBusiness` structured data on every page, plus `FAQPage` markup
- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards
- `sitemap-index.xml` generated on every build; `robots.txt` in `public/`
- Semantic headings, skip link, visible focus states, labelled form fields
- Motion respects `prefers-reduced-motion`; content readable without JavaScript
