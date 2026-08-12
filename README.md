# AI Resume & Skill Gap Analyzer

Full-Stack Application built with React, Vite, Express, and Google Gemini AI.

---

## Deploying to Render

1. Connect your repository to [Render](https://render.com).
2. Click **New +** -> **Blueprint**.
3. Select this repository (Render will automatically detect `render.yaml`).
4. Add your Environment Variable in Render:
   - `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio.
5. Click **Apply**. Render will automatically build and start your Web Service!

---

## Deploying to Vercel

1. Connect your repository to [Vercel](https://vercel.com).
2. Import the project (Vercel will automatically detect `vercel.json` and Vite).
3. Add your Environment Variable under **Environment Variables**:
   - `GEMINI_API_KEY`: Your Google Gemini API Key from Google AI Studio.
4. Click **Deploy**. Vercel will host both the frontend and serverless API automatically!

---

## Local Development

```bash
# Install dependencies
npm install

# Start local server
npm run dev
```
