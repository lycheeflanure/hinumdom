
# HINUMDOM — Catholic Cemetery Locator & Memorial System (Frontend Proposal)

Interactive frontend proposal prototype for **Holy Cross Parish** (Ampayon, Butuan City, Agusan del Norte, Philippines).

This version is streamlined specifically for proposal demonstrations:
- **Zero Backend Dependencies**: Pure frontend prototype running with realistic mock data.
- **Interactive Search**: Search records by name, section, lot number, or niche.
- **Interactive Map**: Leaflet GPS map with cemetery boundary sections, grave markers, and navigation pan/zoom.
- **Record Details**: Full memorial view with biographical records and parish location hierarchy.
- **Admin Portal Demo**: Simulated administrator dashboard with parish record statistics and quick actions.
- **Bilingual**: English and Cebuano (Bisaya) language toggle.

Prerequisites

Before running the project, ensure you have the following installed on your machine:

- **Node.js**: `v18.18.0` or higher (Node `v20.x` or `v24.x` recommended)
- **npm**: `v9.x` or higher (bundled with Node.js)
- A modern web browser (Google Chrome, Firefox, Microsoft Edge, Safari)

To verify your installations, run in your terminal:
```bash
node -v
npm -v
```

## How to Run the Project (Step-by-Step)

### 1. Clone or Open the Repository
Navigate to the project root directory in your terminal or shell:
```bash
cd "hinumdom - Copy"
```

### 2. Configure Environment Variables
Copy `.env.example` to create `.env.local` (if not already present):

**On Windows (PowerShell):**
```powershell
Copy-Item .env.example .env.local
```

**On Windows (Command Prompt):**
```cmd
copy .env.example .env.local
```

**On macOS / Linux:**
```bash
cp .env.example .env.local
```

> **Note:** The proposal prototype uses built-in mock records and does not require an external database or third-party API keys. The default `.env.local` contains:
> ```env
> NEXT_PUBLIC_APP_URL=http://localhost:3000
> ```

---

### 3. Install Dependencies
Install the required packages using `npm`:

```bash
npm install
```

*(On Windows PowerShell, if script execution policy blocks `npm`, see the [Windows Troubleshooting](#windows--powershell-troubleshooting) section below).*

---

### 4. Start the Development Server
Launch the local Next.js development server:

```bash
npm run dev
```

The server will start up with Turbopack enabled:
```
▲ Next.js 16.4.0 (Turbopack)
- Local:   http://localhost:3000
- Environments: .env.local
```

---

### 5. Open in Your Browser
Visit [http://localhost:3000](http://localhost:3000) to view the application.

---

## Production Build & Other Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server with Turbopack at `http://localhost:3000` (auto-sync watcher starts automatically) |
| `npm run sync:watch` | Starts dedicated standalone CLI watcher for automatic `RECORDS TEMPLATE.xlsx` saves |
| `npm run build` | Builds an optimized production bundle with TypeScript checks |
| `npm start` | Runs the production server after building |
| `npm run lint` | Runs ESLint to check for code formatting and type safety issues |

---

## ⚡ Automatic Excel-to-Database Sync (Zero Duplicates)

Whenever you edit and save [RECORDS TEMPLATE.xlsx](file:///c:/Users/Ronnie%20Azura/.gemini/antigravity-ide/scratch/hinumdom%20-%20Copy/RECORDS%20TEMPLATE.xlsx) in Microsoft Excel:
1. Simply press **`Ctrl + S`** in Excel.
2. The background watcher detects the save event, handles Excel's file locks, and syncs the rows into `src/data/registry.json`.
3. **Deduplication Engine**: Uses multi-factor matching (Record ID $\rightarrow$ Name + Section + Lot/Grave/Niche $\rightarrow$ Name + Section + Dates). Existing records update in-place without generating duplicates!
4. **Live Admin UI**: The Admin dashboard (`/admin`) features a live **Auto-Sync** status badge, real-time sync timestamps, and a manual **"Sync Now"** button. Switching back to the browser window automatically refreshes the registry table!

### Running on a Custom Port
If port `3000` is already in use by another application, specify another port:
```bash
npm run dev -- -p 3001
```
Then visit [http://localhost:3001](http://localhost:3001).

---

## Windows / PowerShell Troubleshooting

### Error: `File ... npm.ps1 cannot be loaded because running scripts is disabled on this system`

This is caused by Windows PowerShell's default script execution policy preventing `.ps1` wrapper scripts. You have three easy ways to resolve this:

#### Option A (Recommended — Use `.cmd` directly):
Execute `npm.cmd` instead of `npm`:
```powershell
npm.cmd install
npm.cmd run dev
npm.cmd run build
```

#### Option B (Bypass execution policy for the current terminal session):
Run this command once in your current PowerShell session:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```
Then run `npm run dev` normally.

#### Option C (Use Command Prompt or Git Bash):
Open `cmd.exe` or Git Bash in the project folder and run `npm run dev`.

---

## Key Demo Pages & Navigation

| Route | Description | Direct Link |
| :--- | :--- | :--- |
| **Home Page** | Landing page with quick search, cemetery statistics, and diocesan overview | [http://localhost:3000](http://localhost:3000) |
| **Search Registry** | Search deceased records by name, section, lot number, or niche type | [http://localhost:3000/search](http://localhost:3000/search) |
| **Interactive Map** | Leaflet GPS map with section boundaries, color-coded plots, and markers | [http://localhost:3000/map](http://localhost:3000/map) |
| **Memorial Record Detail** | Individual deceased memorial page (biography, location, prayers) | [http://localhost:3000/record/juan-dela-cruz-1](http://localhost:3000/record/juan-dela-cruz-1) |
| **Admin Login** | Demo login page with 1-click **Quick Demo Login** button | [http://localhost:3000/admin/login](http://localhost:3000/admin/login) |
| **Admin Dashboard** | Simulated cemetery admin console for managing deceased records & plots | [http://localhost:3000/admin](http://localhost:3000/admin) |

### Demo Credentials for Admin Portal
- **URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Email**: `admin@hinumdom.ph`
- **Password**: *(Pre-filled)* or click the **Quick Demo Login** button to enter directly without authentication.

---

## Sample Data to Try in Search
Try searching for these records in the registry:
- **"Dela Cruz"** — Multiple sample records in Section San Jose (Grave plots)
- **"Santos"** — Sample record in Section San Pedro
- **"Bautista"** — Sample inurnment record in Section Santa Maria (Columbarium)
- **Filter by Section**: Choose `Section San Jose`, `Section San Pedro`, `Section Santa Maria`, or `Section San Isidro`.

---

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Mapping & GIS**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Forms & Validation**: React Hook Form & Zod
- **Bilingual Context**: Custom English / Cebuano (Bisaya) translation engine

---

## Project Structure

```
hinumdom/
├── public/               # Static assets & map tile fallbacks
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── admin/        # Admin portal & simulated login
│   │   ├── map/          # Leaflet GPS cemetery map page
│   │   ├── record/[id]/  # Individual memorial profile view
│   │   ├── search/       # Public burial search & filter page
│   │   ├── globals.css   # Tailwind CSS tokens & styling
│   │   ├── layout.tsx    # Root layout with navigation & footer
│   │   └── page.tsx      # Landing page
│   ├── components/       # UI components (Navbar, Footer, Map components)
│   ├── lib/
│   │   ├── i18n/         # Language context (English & Cebuano)
│   │   ├── mockData.ts   # Comprehensive mock cemetery records & sections
│   │   └── utils.ts      # Helper utilities
│   └── types/            # TypeScript domain types & interfaces
├── .env.example          # Example environment configuration
├── package.json          # Node dependencies & npm scripts
└── README.md             # Project documentation & run guide
```
f71ba55 (Initial commit of my folder)