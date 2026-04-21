# FonIQ — Smart Fund Analysis

FonIQ is a mobile application that allows Turkish investors to explore, compare TEFAS funds, and receive AI-powered Turkish insights.

---

## Screenshots

<p align="center">
  <img src="ssApp/2.jpeg" width="22%" />
  <img src="ssApp/1.jpeg" width="22%" />
  <img src="ssApp/3.jpeg" width="22%" />
  <img src="ssApp/4.jpeg" width="22%" />
</p>

---

## Features

- **Fund Discovery** — List 20+ investment funds, filter by category and name  
- **Fund Details** — 1-month, 3-month, 6-month, and 1-year return performance  
- **Fund Comparison** — Compare 2 funds side by side and see which performs better  
- **AI Insight** — Get personalized Turkish fund analysis with Gemini AI  
- **AI Chat** — Ask anything about investment funds in a conversational format  

---

## Tech Stack

| Layer      | Technology          |
| ---------- | ------------------- |
| Mobile     | React Native + Expo |
| Navigation | Expo Router         |
| State      | Zustand             |
| AI         | Google Gemini API   |
| Backend    | Node.js + Express   |
| Data       | Mock TEFAS data     |

---

## Setup

### Requirements

- Node.js 18+  
- Expo Go (mobile device) or Android Emulator  
- Google Gemini API Key  

### 1. Clone the Project

```bash
git clone https://github.com/kullanici-adi/foniq.git
cd foniq
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Environment Variables

Create a `.env.local` file in the project root:

```
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

To get a Gemini API key: [aistudio.google.com](https://aistudio.google.com)

### 4. Start Backend

```bash
cd backend
npm install
node server.js
```

Backend runs at `http://localhost:3000`.

### 5. Start the App

```bash
cd ..
npx expo start
```

---

## Project Structure

```
FonIQ/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx        # Explore screen
│   │   ├── compare.tsx      # Comparison screen
│   │   └── ai.tsx           # AI Chat screen
│   └── fund/
│       └── [code].tsx       # Fund Detail screen
├── components/
│   ├── FundCard.tsx
│   ├── FundChart.tsx
│   ├── RiskBadge.tsx
│   └── ChatBubble.tsx
├── services/
│   ├── tefas.ts             # Fund data service
│   └── gemini.ts            # AI service
├── store/
│   ├── useProfileStore.ts   # User profile
│   └── useCompareStore.ts   # Comparison state
├── constants/
│   ├── colors.ts
│   └── config.ts
├── types/
│   └── fund.ts
└── backend/
    └── server.js            # Express proxy server
```

---

## Screen Descriptions

### Explore

Lists all funds. Can be filtered using category chips (Equity, Balanced, Bond, Gold, Money Market). Search bar allows searching by fund code or name.

### Fund Detail

Displays the selected fund’s return performance (1M, 3M, 6M, 1Y), portfolio size, and number of investors. AI insight button provides Turkish analysis via Gemini.

### Compare

Two funds are compared side by side. The better-performing metric is highlighted in green.

### AI Chat

Ask questions about investment funds in a chat format using Gemini AI. Responses are fully in Turkish.

---

## Development Notes

- Direct mobile access to TEFAS API is not possible due to CORS restrictions. Therefore, an Express.js proxy backend is used.  
- Currently, mock data is used. Real TEFAS data can be integrated by modifying the backend.  
- Gemini API Free Tier has a daily limit of 1500 requests.  

---

## License

MIT License — Freely usable and modifiable.

---

_FonIQ — Developed as a portfolio project._
