# 🎬 Brig Media — Official Website

A state-of-the-art, high-performance web experience built for **Brig Media**. This application showcases creative video productions, brand films, event highlights, and social reels with fluid 3D graphics, smooth inertia scrolling, and ultra-fast video streaming via Cloudinary CDN.

---

## ✨ Features

- **⚡ Fast CDN Video Streaming**: All high-definition video assets are hosted on Cloudinary CDN for instant playback with zero local storage footprint.
- **🎨 Interactive 3D Canvas & Models**: Built using React Three Fiber (`@react-three/fiber`), Drei, and Three.js with an interactive 3D physics-enabled lanyard.
- **🌊 Smooth Inertia Scroll & GSAP Animations**: Enhanced user experience with Lenis smooth scrolling and timeline-based GSAP & Framer Motion animations.
- **📁 Categorized Portfolio Gallery**: Dynamic filtering across *Brand Film*, *Event*, and *Reels* categories.
- **📱 Fully Responsive & Mobile Optimized**: Responsive grid layout and touch-friendly controls.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **UI Library** | [React 18](https://react.dev/) |
| **3D Graphics & Physics** | [Three.js](https://threejs.org/), [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber), [@react-three/drei](https://github.com/pmndrs/drei), [@react-three/rapier](https://github.com/pmndrs/react-three-rapier) |
| **Animations** | [GSAP](https://gsap.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Smooth Scroll** | [Lenis](https://lenis.darkroom.engineering/) |
| **Media Hosting** | [Cloudinary Video CDN](https://cloudinary.com/) |
| **Styling** | Modern CSS / HSL Tokens |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. Clone or extract the project repository:
   ```bash
   git clone https://github.com/vigneshbs1809-website/Brig-Media.git
   cd Brig-Media
   ```

2. Install dependencies:
   ```bash
   npm install
   ```
   *(Note: An `.npmrc` file is included to automatically handle legacy peer dependencies).*

### Running Locally

Start the local development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📦 Building for Production

To create an optimized production build:

```bash
npm run build
```

To start the production server locally:

```bash
npm start
```

---

## 📂 Project Structure

```text
├── public/
│   └── assets/
│       ├── card.glb          # 3D Model Asset
│       ├── lanyard.png       # Texture Asset
│       ├── logo.png          # Brand Logo
│       └── stars-bg.jpg      # Background Texture
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root Layout & Metadata
│   │   └── page.tsx          # Main Web Experience & Gallery
│   ├── components/           # 3D Scenes, Custom Cursors & UI Components
│   └── hooks/                # Custom React Hooks
├── .npmrc                    # NPM Configuration for peer dependencies
├── next.config.js            # Next.js Configuration
└── package.json              # Dependencies and Scripts
```

---

## 🌐 Deployment

This project can be easily deployed on **Vercel** or **Netlify**:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set Framework Preset to **Next.js**.
4. Click **Deploy**.

---

## 📄 License

© 2026 **Brig Media**. All rights reserved.
