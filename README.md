# 🌿 Antigravity — Mental Health Support for Students

A calming, stigma-free emotional support platform built with React + Vite + Tailwind CSS.

## Pages

| Route        | Description                                      |
|--------------|--------------------------------------------------|
| `/`          | Landing page with hero, features, and CTAs       |
| `/mood`      | Emoji mood check-in with personalized responses  |
| `/chat`      | AI-style chat with empathetic dummy responses    |
| `/vent`      | Anonymous venting with category selector         |
| `/gym`       | Mental exercises: breathing, journaling, reframe |
| `/dashboard` | Mood history chart + quick actions               |

## Quick Start

```bash
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

## Stack

- React 18 + Vite 5
- React Router v6
- Tailwind CSS v3
- Google Fonts: Playfair Display + Nunito

## Structure

```
src/
├── components/     # Reusable UI (Navbar lives in Layout)
├── pages/          # One file per route
│   ├── Landing.jsx
│   ├── Mood.jsx
│   ├── Chat.jsx
│   ├── Vent.jsx
│   ├── Gym.jsx
│   └── Dashboard.jsx
├── layouts/
│   └── Layout.jsx  # Navbar + footer wrapper
├── App.jsx         # Route definitions
├── main.jsx        # React entry
└── index.css       # Tailwind + custom utilities
```

## Design System

| Token      | Value            |
|------------|------------------|
| Primary    | #A7C7E7 (Soft Blue)  |
| Secondary  | #CDB4DB (Lavender)   |
| Background | #F8F5F2 (Warm Beige) |
| Accent     | #B7E4C7 (Muted Green)|
| Display    | Playfair Display     |
| Body       | Nunito               |

## Notes

- 100% frontend only — no backend, no API keys needed
- All AI responses are pre-written dummy data
- Vent posts are sample data (UI only)
- Mood history on Dashboard uses dummy data
