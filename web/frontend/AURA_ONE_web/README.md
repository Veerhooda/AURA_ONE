# AURA ONE Web Dashboard 🖥️

The next-generation administrative and hospital staff portal for the AURA ONE ecosystem. Built with speed and modern aesthetics in mind.

## ⚡ Tech Stack

### Core Framework & Build

- **React (v19)**: Leveraging the latest React features for concurrent rendering and state management.
- **Vite (v7)**: Blazing fast build tool and dev server (HMR).
- **JavaScript (ES Modules)**: Modern ES6+ syntax.

### Navigation & Routing

- **React Router DOM (v7)**: efficient client-side routing for seamless page transitions.

### UI & Styling

- **Medical Dark Theme**: Custom `index.css` using CSS Variables for a consistent, premium dark mode palette (`Slate 900` bg, `Sky 400` primary).
- **Glassmorphism**: Native CSS implementation of blur/transparency effects for cards and panels.
- **Lucide React**: Clean, medical-grade icon set.
- **Responsive Design**: Mobile-first media queries with sidebar transitions.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

```bash
# Navigate to the web project
cd web/frontend/AURA_ONE_web

# Install dependencies
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

> The app will run at `http://localhost:5173` by default.

### Build via Vite

Create a production-ready bundle:

```bash
npm run build
```

## 📂 Project Structure

- **`src/components/`**: Reusable UI blocks (Navbar, Sidebar, Cards).
- **`src/pages/`**: Route views (Login, DoctorDashboard, PatientReport).
- **`src/index.css`**: Global design system (Variables, Typography, Utilities).
- **`src/App.jsx`**: Main routing configuration.

## 🎨 Design System

The app follows a strict "Medical Dark" aesthetic:

- **Primary**: Sky 400 (`#38BDF8`) - Used for active states and primary actions.
- **Danger**: Red 400 (`#F87171`) - Used for critical alerts.
- **Glass**: `backdrop-filter: blur(12px)` - Used on all panels.

## 🛠️ Key Features

- **Role-Based Dashboards**: Distinct views for Doctors (Vitals/Reports), Patients, and Family members.
- **Real-time Context**: Uses basic React Context for managing global state.
- **Patient Records**: Detailed view of patient history and current vitals.
