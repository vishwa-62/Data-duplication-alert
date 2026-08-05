# 🛡️ Data Download Duplication Alert System

An enterprise-grade Full-Stack platform designed to detect, track, alert, and prevent redundant dataset downloads. The system optimizes network bandwidth, reduces server compute load, prevents database strain, and alerts Security Operations Center (SOC) teams to download anomalies in real time.

---

## 🌟 Core Features

- **⚡ Live Duplication Detection Engine**: Uses MD5 fingerprinting (`user + dataset + filter params`) within configurable sliding time windows (e.g. 60 mins) to identify duplicate requests.
- **🚨 Threat Risk Escalation**: Automatically calculates risk levels (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) based on download frequency and dataset sensitivity.
- **🛡️ Dynamic User Risk Scoring**: Monitors user download behavior (0-100 score) and provides Admin capability to **Freeze / Unfreeze** user download privileges.
- **💾 Local Cache Payload Serving**: Serves repeat requests directly from local cache with **0 MB network bandwidth consumed**.
- **🔒 Custom Security Policy Builder**: Create custom security rules (e.g. max payload size caps, auto-blocking, cache enforcement).
- **🎨 Multi-Theme System**: Includes 4 curated UI themes (`Cyber Dark`, `Emerald Matrix`, `Neon Sunset`, `Enterprise Slate`).
- **📡 Animated Live Threat Radar**: Canvas radar visualization scanning active download nodes and anomaly targets.
- **🗺️ Interactive System Topology**: Visual architecture diagram mapping Data Repositories ➔ Detection Engine ➔ Personas ➔ Cache Nodes.
- **📊 Compliance Audit Logs & Data Export**: Immutable audit trail with one-click **CSV** and **JSON** export.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Lucide Icons, Custom Vanilla CSS Design Tokens (Glassmorphism, Animations, Multi-theme).
- **Backend**: Node.js, Express.js REST API, Hashing Engine (`crypto`).
- **Database**: SQLite (`sqlite3`) with automatic schema migrations & seed data.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- npm

### 2. Installation

Clone the repository:
```bash
git clone https://github.com/vishwa-62/Data-duplication-alert.git
cd Data-duplication-alert
```

Install Backend Dependencies:
```bash
cd server
npm install
```

Install Frontend Dependencies:
```bash
cd ../client
npm install
```

### 3. Running the Application

**Start the Backend Express API Server (Port 5000):**
```bash
cd server
npm start
```

**Start the Frontend React Vite App (Port 5173):**
```bash
cd client
npm run dev
```

Open your browser and navigate to:
- **Frontend App**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5000/api`

---

## 📋 REST API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/datasets` | List all available datasets |
| `POST` | `/api/downloads/request` | Submit download request & execute detection engine |
| `POST` | `/api/downloads/serve-cached` | Serve requested payload from local cache |
| `GET` | `/api/users` | List users with risk scores & frozen status |
| `POST` | `/api/users/:id/freeze` | Suspend user download privileges |
| `POST` | `/api/users/:id/unfreeze` | Restore user download privileges |
| `GET` | `/api/alerts` | List SOC duplicate download threat alerts |
| `PATCH` | `/api/alerts/:id` | Resolve or dismiss alert with audit note |
| `GET` | `/api/policies` | List custom security policy rules |
| `POST` | `/api/policies` | Create a new security policy rule |
| `GET` | `/api/audit-logs` | Fetch immutable download audit log |
| `GET` | `/api/audit-logs/export?format=csv` | Export audit log to CSV file |
| `GET` | `/api/analytics` | Fetch system KPIs and 24h traffic trends |

---

## 📄 License
This project is licensed under the MIT License.
