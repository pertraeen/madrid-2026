# madrid-2026

Personal website built with **VitePress** and automatically deployed to **GitHub Pages** using **GitHub Actions**.

## Architecture

```text
VitePress
    ↓
GitHub Repository
    ↓
GitHub Actions
    ↓
GitHub Pages
```

Every push to the `main` branch automatically builds and deploys the site.

---

## Repository

GitHub repository:

```text
https://github.com/pertraeen/madrid-2026
```

Published site:

```text
https://pertraeen.github.io/madrid-2026/
```

---

## Development Environment

Required software:

- Git
- Node.js (LTS recommended)
- Visual Studio Code

Verify installation:

```bash
git --version
node --version
npm --version
```

---

## Clone Repository on a New Computer

Open a terminal and clone the repository:

```bash
git clone git@github.com:pertraeen/madrid-2026.git
```

Alternatively using HTTPS:

```bash
git clone https://github.com/pertraeen/madrid-2026.git
```

Change into the project directory:

```bash
cd madrid-2026
```

---

## Install Dependencies

Install all required packages:

```bash
npm install
```

This recreates the `node_modules` folder from `package.json` and `package-lock.json`.

---

## Open in Visual Studio Code

From the repository root:

```bash
code .
```

Alternatively:

1. Open Visual Studio Code
2. Select **File → Open Folder**
3. Choose the `madrid-2026` folder

---

## Run Locally

Start the VitePress development server:

```bash
npm run docs:dev
```

Open the displayed URL in your browser, typically:

```text
http://localhost:5173
```

Changes are automatically reloaded when files are saved.

---

## Build Site Locally

Create a production build:

```bash
npm run docs:build
```

Output is generated in:

```text
docs/.vitepress/dist
```

---

## Preview Production Build

Preview the generated site locally:

```bash
npm run docs:preview
```

---

## Updating the Site

After making changes:

```bash
git add .
git commit -m "Describe your changes"
git push
```

GitHub Actions will automatically:

1. Install dependencies
2. Build the VitePress site
3. Deploy to GitHub Pages

---

## Repository Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docs/
│   ├── .vitepress/
│   └── index.md
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## Git Notes

The following folders should **not** be committed:

```text
node_modules/
dist/
```

These are excluded through `.gitignore`.

The following files should always be committed:

```text
package.json
package-lock.json
```

This ensures consistent dependency versions locally and in GitHub Actions.

---

## Deployment

Deployment is automatic through GitHub Actions.

Any push to:

```text
main
```

triggers:

```text
Build → Deploy → Publish
```

The published site is available at:

```text
https://pertraeen.github.io/madrid-2026/
```

---

## First-Time Setup on a New Computer

```bash
git clone git@github.com:pertraeen/madrid-2026.git
cd madrid-2026
npm install
code .
npm run docs:dev
```

You are now ready to develop and preview the site locally.
