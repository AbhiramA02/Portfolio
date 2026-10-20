# Abhiram Agina — Portfolio

React + Vite personal site for **[abhiramagina.xyz](https://abhiramagina.xyz)**.

## Local development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Hosting (GitHub Pages)

This repo deploys the `dist/` build to **GitHub Pages** on every push to `main` (see `.github/workflows/deploy.yml`).

### One-time setup (repo)

1. GitHub → **Settings → Pages**
2. **Build and deployment → Source**: GitHub Actions
3. **Custom domain**: `abhiramagina.xyz` → Save  
   (`public/CNAME` already contains this hostname)
4. After DNS propagates, enable **Enforce HTTPS**

Until the custom domain is pointed here, the site is also available at:

`https://abhirama02.github.io/Portfolio/`  
(Note: that project URL needs `base: '/Portfolio/'` in Vite if you rely on it long-term. Prefer the custom domain with `base: '/'`.)

### DNS at BlueHost (required for abhiramagina.xyz)

Nameservers are currently `ns1.bluehost.com` / `ns2.bluehost.com`. In BlueHost DNS zone editor:

1. **Remove** the apex `A` record pointing at the old EC2 IP `3.143.152.177`
2. **Add** apex `A` records for GitHub Pages:

   | Type | Name | Value            |
   | ---- | ---- | ---------------- |
   | A    | `@`  | `185.199.108.153` |
   | A    | `@`  | `185.199.109.153` |
   | A    | `@`  | `185.199.110.153` |
   | A    | `@`  | `185.199.111.153` |

3. **Optional but recommended** — `www` CNAME → `AbhiramA02.github.io`
4. Wait for propagation, then turn on **Enforce HTTPS** in Pages settings

### Why not EC2 anymore?

The previous workflow SSHed to EC2, ran `npm run build`, and reloaded nginx. That job still reported success, but the live host at `3.143.152.177` served `<h1>Welcome</h1>` (Rails-style headers) with an SSL certificate for **`ubaxiapp.com`**, not this portfolio. Recovering that box needs AWS login + nginx/cert fixes; GitHub Pages restores a correct HTTPS site without that.

EC2 secrets (`EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `EC2_PATH`) are unused by the new workflow and can be deleted from repo secrets once Pages is live.

## Project notes

- Homepage: `src/App.jsx` (links out to IVEvents)
- Extra route: `/jerseyselector` (`src/pages/JerseySelector.jsx`)
- `spotify-wrapped/` is a separate Flask + Vite experiment; it is **not** part of the Pages deploy. Do not commit `.env` files there — rotate any keys that were previously committed.
