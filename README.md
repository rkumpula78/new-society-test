<!-- location: README.md -->
<!-- this README explains the structure and purpose of this template. -->
<!-- it is not a comprehensive user manual. -->

# AI SAAS Starter

This repo provides a minimal template for an AI Software as a Service project. It keeps the stack simple.

## Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/)
- **Backend:** [FastAPI](https://fastapi.tiangolo.com/)
- **Database:** [Supabase](https://supabase.com/)
- **Icons:** [Lucide React](https://lucide.dev/icons)

## Folder Structure

```
.
├── backend        # FastAPI application
│   ├── app.py
│   └── requirements.txt
├── frontend       # Next.js application
│   ├── pages
│   │   └── index.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── next-env.d.ts
└── index.html     # placeholder landing page
```

## Setup

### Frontend

1. Install Node.js dependencies.
   ```bash
   cd frontend
   npm install
   ```
2. Copy `.env.local.example` to `.env.local` and set Supabase keys.
3. Run the development server.
   ```bash
   npm run dev
   ```

### Backend

1. Install Python packages.
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
2. Start the API server.
   ```bash
   uvicorn app:app --reload
   ```

Both servers run independently. The frontend communicates with Supabase directly.

## Notes

- The code is intentionally lightweight to serve as a foundation.
- Adjust authentication, hosting and CI/CD to your needs.
