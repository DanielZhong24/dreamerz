# Dreamerz - Global Dream Connect

**Explore the collective unconscious. Connect with dreamers worldwide.**

Dreamerz is a social media application where users upload their dreams (via text or voice), which are then visualized on a 3D globe and matched with other users who have shared similar dream themes.

## 🚀 Core Concept

1. **Capture Dreams:** Record dreams using text or voice-to-text.
2. **Geo-Visualization:** Plot dream origins on an interactive 3D globe.
3. **Semantic Matching:** AI analyzes dream content to identify themes and keywords.
4. **Connect:** Visual connections are drawn between users with similar dreams.

## ✨ Key Features

- **Interactive 3D Globe:** Built with `react-globe.gl`, visualizing dreams across the world.
- **AI-Powered Analysis:** Uses Google Gemini (`gemini-2.5-flash`) for keywords, sentiment, location, and content generation.
- **Generative Media:** Automatically generates dreamscape images and videos using Gemini and Nano Banana models.
- **Smart Matching:** Connects users based on shared dream keywords:
  - 🟢 **Green:** Your dreams
  - 🟡 **Yellow:** Connected dreams (shared themes)
  - 🔴 **Red:** Other dreams
- **Voice Input:** Integrated speech-to-text for easy dream logging.
- **Secure Auth:** Powered by Supabase Authentication.

## 🧠 Gemini AI Integration

Dreamerz leverages Google's Gemini models (`gemini-2.5-flash` and Nano Banana) to power its core intelligence:

- **Semantic Analysis:** Extracts 5 key themes from dream descriptions to enable smart matching between users.
- **Sentiment & Naming:** Automatically generates creative titles and analyzes the emotional tone of dreams.
- **Location Intelligence:** Converts raw coordinates into readable city/country names for the globe visualization.
- **Generative Art:** Creates unique dreamscape thumbnails and videos based on the dream's narrative.

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Framer Motion, shadCN
- **3D Visualization:** react-globe.gl (Three.js)
- **Backend & Auth:** Supabase
- **AI & ML:** Google Gemini API (Text, Image, Video)
- **Media Storage:** Cloudinary
- **Icons:** Lucide React
