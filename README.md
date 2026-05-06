# Miss Koreya / MY Cosmetic

Korean cosmetics shop in Bukhara — FastAPI + PostgreSQL + Telegram Mini App.

## What's inside

```
backend/        FastAPI + SQLAlchemy + asyncpg + JWT admin auth
  app/
    main.py            app entrypoint, mounts frontend, runs seed on startup
    config.py          .env settings
    database.py        async engine + session
    models.py          Admin / Product / Order / OrderItem
    schemas.py         pydantic v2 schemas
    auth.py            JWT + bcrypt
    seed.py            creates admin + 9 starter products on first run
    telegram_notifier.py  sends new orders to admin chat via Bot API
    routers/
      products.py      public list + admin CRUD
      orders.py        public POST + admin list/patch
      admin.py         POST /api/admin/login → JWT
  .env.example
  requirements.txt

bot/            Telegram bot (aiogram 3) — /start with Mini App button
  bot.py
  requirements.txt

frontend/       Static files served by FastAPI (or nginx)
  index.html         Public shop (also opens as Telegram Mini App)
  shop.js            Cart + checkout logic, Telegram WebApp SDK integration
  admin.html         Login + orders + products management

deploy/         Ubuntu production files
  nginx.conf
  misskoreya-api.service
  misskoreya-bot.service
```

The original design file `Miss_koreya_updated (3).html` is kept as a visual reference; the new `frontend/index.html` reproduces its style and pulls the catalog from the API. To restore the original photos, upload them to your server (or any image host) and set `image_url` per product through the admin panel.

## Local development (Windows)

```powershell
cd "D:\projects\miss koreya\backend"
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Install PostgreSQL locally OR use a remote DB. Then:
copy .env.example .env
# edit .env: set DATABASE_URL, SECRET_KEY, ADMIN_PASSWORD,
#            TELEGRAM_BOT_TOKEN, TELEGRAM_ADMIN_CHAT_ID

# Create the DB once (psql):
#   CREATE USER misskoreya WITH PASSWORD '...';
#   CREATE DATABASE misskoreya OWNER misskoreya;

uvicorn app.main:app --reload
```

Open http://127.0.0.1:8000 — shop. Open http://127.0.0.1:8000/admin — admin (default `admin` / value of `ADMIN_PASSWORD`).

Bot (separate terminal):
```powershell
cd "D:\projects\miss koreya\bot"
pip install -r requirements.txt
python bot.py
```

## Deploying to Ubuntu (22.04 / 24.04)

### 1. Install dependencies

```bash
sudo apt update
sudo apt install -y python3 python3-venv python3-pip postgresql nginx git
```

### 2. PostgreSQL — create user + database

```bash
sudo -u postgres psql <<'SQL'
CREATE USER misskoreya WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE misskoreya OWNER misskoreya;
SQL
```

### 3. Create app user and copy the project

```bash
sudo useradd -r -s /usr/sbin/nologin -m -d /opt/misskoreya misskoreya
sudo mkdir -p /opt/misskoreya
# Upload the project (rsync, scp, or git clone) so you end up with:
#   /opt/misskoreya/backend
#   /opt/misskoreya/bot
#   /opt/misskoreya/frontend
sudo chown -R misskoreya:misskoreya /opt/misskoreya
```

### 4. Python virtualenv

```bash
sudo -u misskoreya python3 -m venv /opt/misskoreya/venv
sudo -u misskoreya /opt/misskoreya/venv/bin/pip install --upgrade pip
sudo -u misskoreya /opt/misskoreya/venv/bin/pip install -r /opt/misskoreya/backend/requirements.txt
sudo -u misskoreya /opt/misskoreya/venv/bin/pip install -r /opt/misskoreya/bot/requirements.txt
```

### 5. Configure `.env`

```bash
sudo cp /opt/misskoreya/backend/.env.example /opt/misskoreya/backend/.env
sudo nano /opt/misskoreya/backend/.env
# Set:
#   DATABASE_URL=postgresql+asyncpg://misskoreya:STRONG_PASSWORD_HERE@localhost:5432/misskoreya
#   PUBLIC_SITE_URL=https://your-domain.com
#   SECRET_KEY=$(openssl rand -hex 32)
#   ADMIN_USERNAME=admin
#   ADMIN_PASSWORD=...
#   TELEGRAM_BOT_TOKEN=...        (from @BotFather)
#   TELEGRAM_ADMIN_CHAT_ID=...    (run /id command in your bot to get it)
sudo chown misskoreya:misskoreya /opt/misskoreya/backend/.env
sudo chmod 640 /opt/misskoreya/backend/.env
```

### 6. Install systemd units

```bash
sudo cp /opt/misskoreya/deploy/misskoreya-api.service /etc/systemd/system/
sudo cp /opt/misskoreya/deploy/misskoreya-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now misskoreya-api
sudo systemctl enable --now misskoreya-bot
sudo systemctl status misskoreya-api misskoreya-bot
```

The first start of `misskoreya-api` will create all tables and seed the 9 starter products + the admin user automatically (see `app/seed.py`).

### 7. nginx + HTTPS

```bash
sudo cp /opt/misskoreya/deploy/nginx.conf /etc/nginx/sites-available/misskoreya
sudo nano /etc/nginx/sites-available/misskoreya     # change server_name
sudo ln -s /etc/nginx/sites-available/misskoreya /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# HTTPS — REQUIRED for Telegram Mini App
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 8. Connect the bot to the Mini App

1. Talk to **@BotFather** in Telegram → `/newbot` (or use existing) → copy token into `.env` as `TELEGRAM_BOT_TOKEN`.
2. `@BotFather` → `/mybots` → pick the bot → **Bot Settings → Menu Button → Configure menu button** → paste `https://your-domain.com`. Now opening the bot shows a "Магазин" button at the bottom of the chat.
3. To learn your admin chat id: send `/id` to the bot, copy the number into `.env` as `TELEGRAM_ADMIN_CHAT_ID`, then `sudo systemctl restart misskoreya-api misskoreya-bot`.

### 9. Verify

* Open `https://your-domain.com` — shop loads, products listed, cart works, checkout submits.
* Open `https://your-domain.com/admin` — log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
* Place a test order on the shop — within ~1 second a Telegram message arrives in the admin chat **and** the order appears in `/admin`.
* In Telegram, open the bot, tap the "Магазин" button — same shop opens as a Mini App; checkout will tag the order with your Telegram username.

## Updating

```bash
# upload new files into /opt/misskoreya/, then:
sudo systemctl restart misskoreya-api misskoreya-bot
```

If you add columns/tables, run a migration. The codebase is set up for Alembic; bootstrap with:

```bash
cd /opt/misskoreya/backend
sudo -u misskoreya /opt/misskoreya/venv/bin/alembic init alembic
# edit alembic/env.py: set target_metadata = Base.metadata from app.database
sudo -u misskoreya /opt/misskoreya/venv/bin/alembic revision --autogenerate -m "..."
sudo -u misskoreya /opt/misskoreya/venv/bin/alembic upgrade head
```

For the current schema you don't need Alembic — `seed.py` calls `Base.metadata.create_all` on first start.

## Order lifecycle

`new` → `confirmed` → `shipped` → `delivered` (or `cancelled` at any step). Status is changed from the admin panel.

## API summary

Public:
- `GET /api/products` — in-stock products
- `POST /api/orders` — create order

Admin (Bearer JWT from `/api/admin/login`):
- `GET /api/admin/products` · `POST` · `PUT /{id}` · `DELETE /{id}`
- `GET /api/admin/orders[?status=...]` · `GET /{id}` · `PATCH /{id}` (status)
- `POST /api/admin/login`

Interactive docs at `/docs`.
