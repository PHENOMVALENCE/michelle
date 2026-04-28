# Michelle Mugo Portfolio

Personal portfolio website for Michelle Mugo, built as a static HTML/CSS/JS site and deployed on Vercel.

## Project Configuration

- **Hosting platform:** Vercel
- **Primary domain:** `michellemugo.live`
- **Domain registrar:** Name.com
- **Domain ownership/account note:** Domain is managed under the **BettyKidugo** account via the **GitHub Student Developer Pack** (1-year package).

## Routing and SEO Configuration

- `vercel.json`
  - `cleanUrls: true`
  - `trailingSlash: false`
- Sitemap files:
  - `sitemap.xml`
- Robots files:
  - `robots.txt`

## Local Development

Because this is a static site, you can run it with any local static server.

Example (if you have Node.js):

```bash
npx serve .
```

Or with Python:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.

## Main Pages

- `/` (Home)
- `/project` (Project details)
- `/terms` (Terms and conditions)
- `/privacy` (Privacy policy)
