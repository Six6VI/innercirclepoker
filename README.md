# Inner Circle Poker

Dynamic club website with server-side authentication and shared standings data.

## Tech Stack

- Node.js + Express server
- Server-side sessions (cookie-based)
- SQLite database (seeded from existing CSV files)
- Existing HTML/CSS/JS pages served by Express

## Local Run

1. Install dependencies:
	npm install
2. Start the server:
	npm start
3. Open:
	http://localhost:8080

On first run, data is imported from `users.csv` and `standings.csv` into `data/innercircle.db`.

## Dynamic API Endpoints

- `POST /api/login`
- `POST /api/logout`
- `GET /api/me`
- `POST /api/change-password`
- `GET /api/standings`
- `POST /api/standings` (admin only)

## Deploy To Azure Portal (Web App)

1. In Azure Portal, create a **Web App**:
	- Publish: Code
	- Runtime stack: Node 22 LTS (or latest LTS)
	- Operating system: Linux
2. In Web App -> **Configuration** -> Application settings, add:
	- `SESSION_SECRET` = a long random value
	- Optional: `PORT` = `8080`
3. Deploy code with one of these methods:
	- Deployment Center (GitHub)
	- Zip Deploy from local source
4. Set startup command if needed:
	npm start
5. Browse to the Web App URL and log in.

Notes:
- App Service persists files in the app storage, so SQLite works for small club usage.
- If you scale out to multiple instances, move standings/users to Azure SQL Database.