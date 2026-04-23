# Project Notes

## Tech Stack
- **Framework**: Astro v6 (static site generator)
- **Styling**: Plain CSS with CSS Modules (no Tailwind)
- **Backend**: Python FastAPI (in `api/` directory)
- **Package Management**: npm for Node, uv for Python

## Commands

### Astro (Frontend)
```bash
npm run dev        # Start dev server on http://localhost:4321
npm run build      # Build static site to dist/
npm run preview    # Preview built site locally
```

### API (Backend)
```bash
cd api
uv sync                      # Install Python dependencies
uv run uvicorn app.main:app --reload    # Dev server on http://localhost:8000
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000  # Production
uv run pytest                 # Run tests
```

## Architecture
- Portfolio projects: markdown files in `src/content/projects/`
- Storefront services: markdown files in `src/content/services/`
- Site data (name, contact): `src/data/site.ts` (typed TS module — Vite needs plugin for YAML so we use TS)
- Content collection schemas: `src/content.config.ts` (Astro v6 format with glob loader)
- Each service markdown file defines its own commission form fields in frontmatter
- Commission forms POST JSON to `/api/commissions` on the FastAPI backend
- API validates with Pydantic models, sends email notification via SMTP (falls back to logging if unconfigured)

## Content Model
- Projects use frontmatter: title, slug, description, image, tags, role, tech, year, featured, links
- Services use frontmatter: title, slug, description, image, price, priceType, category, featured, order, form (with fields and addons)
- Site data in `src/data/site.ts`: name, title, tagline, email, phone, location, url, social links, footer copyright
- Form fields support: text, select, textarea, number, checkbox input types
- Addons have: id, label, price (display string)

## File Structure
```
src/
├── content.config.ts     # Astro v6 content collection schemas
├── content/
│   ├── projects/          # Portfolio project markdown files
│   └── services/         # Storefront service markdown files
├── data/
│   └── site.ts           # Site-wide data (name, contact, social)
├── layouts/
│   └── BaseLayout.astro   # HTML shell, header, footer
├── pages/
│   ├── index.astro        # Front page (hero + featured projects)
│   ├── projects/
│   │   ├── index.astro    # All projects listing
│   │   └── [...slug].astro # Individual project detail
│   └── storefront.astro  # Services + commission forms
├── components/            # Astro components
└── styles/               # CSS modules + global.css

api/
├── app/
│   ├── main.py            # FastAPI app
│   ├── config.py          # Settings from env vars
│   ├── routes/
│   │   └── commissions.py # POST /api/commissions
│   └── models/
│       └── commission.py  # Pydantic models
├── tests/
│   └── test_commissions.py
├── pyproject.toml          # Python deps (uv)
└── .env.example           # Environment variable template
```

## Customization
- Edit `src/data/site.ts` to update your name, email, social links
- Add/edit markdown files in `src/content/projects/` for portfolio items
- Add/edit markdown files in `src/content/services/` for storefront services
- Each service's `form` frontmatter defines its own fields and addons
- Edit `src/styles/global.css` to change design tokens (colors, fonts, spacing)
- Edit `api/.env` to configure SMTP for email notifications

## Deployment

### 1. Build the static site
```bash
npm run build     # Outputs to dist/
```

### 2. Configure the API
```bash
cd api
cp .env.example .env
# Edit .env with your SMTP credentials, notification email, production URL, and CORS origins
```

Key environment variables (all prefixed with `API_`):
- `API_CORS_ORIGINS` — JSON array of allowed origins, e.g. `["https://yoursite.com"]`
- `API_SMTP_HOST` — SMTP server hostname
- `API_SMTP_PORT` — SMTP port (default 587)
- `API_SMTP_USER` / `API_SMTP_PASS` — SMTP credentials
- `API_NOTIFICATION_EMAIL` — where to send commission alerts
- `API_SITE_URL` — your production site URL

### 3. Set up the API as a systemd service
Create `/etc/systemd/system/portfolio-api.service`:
```ini
[Unit]
Description=Portfolio Storefront API
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/merged-portfolio-freelance/api
ExecStart=/path/to/merged-portfolio-freelance/api/.venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5
EnvironmentFile=/path/to/merged-portfolio-freelance/api/.env

[Install]
WantedBy=multi-user.target
```

Then:
```bash
sudo systemctl daemon-reload
sudo systemctl enable portfolio-api
sudo systemctl start portfolio-api
```

### 4. Configure nginx
Create `/etc/nginx/sites-available/yoursite.com`:
```nginx
server {
    listen 80;
    server_name yoursite.com www.yoursite.com;

    # Static site
    root /path/to/merged-portfolio-freelance/dist;
    index index.html;

    # SPA fallback — serve index.html for unknown routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Reverse proxy API requests to FastAPI
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Then:
```bash
sudo ln -s /etc/nginx/sites-available/yoursite.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. Add SSL with Certbot
```bash
sudo certbot --nginx -d yoursite.com -d www.yoursite.com
```

### 6. Updating the site
After pulling changes:
```bash
# Rebuild static site
npm run build

# Restart API (if API code changed)
sudo systemctl restart portfolio-api
```

## Notes
- Astro v6 uses `src/content.config.ts` (not `src/content/config.ts`) with `glob()` loaders
- Site data is TypeScript (not YAML) because Vite needs a plugin for YAML imports
- Commission form JS is inline (Astro `<script>` tag) for zero external dependencies
- API gracefully falls back to logging if SMTP is not configured