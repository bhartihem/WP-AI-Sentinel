# WordPress AI Sentinel 🛡️

WordPress AI Sentinel is an open-source, AI-powered WordPress management suite. Manage posts, audit security, optimize SEO, and monitor performance — all from one unified interface, powered by WP AI Sentinel Team.

## 🚀 Features

- **AI Agents**: Specialized agents for Development, Marketing, and SEO.
- **Real-time Monitoring**: Track site health, uptime, and performance.
- **Security Audits**: Scan for vulnerabilities and check security plugin compatibility.
- **SEO Optimization**: Keyword research, content auditing, and backlink simulation.
- **Snapshot & Undo**: Create snapshots before making changes and restore them if needed.
- **Activity Log**: Complete audit trail of all AI-performed actions.
- **Multi-language Support**: Available in English, Hindi, and more.

## 🛠️ Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Firebase Project](https://console.firebase.google.com/)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey)

### Local Installation (VS Code / Terminal)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bhartihem/WP-AI-Sentinel.git
   cd wp-ai-sentinel
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```
   You will need to provide:
   - `GEMINI_API_KEY`: Your Google Gemini API key.
   - `VITE_FIREBASE_*`: Your Firebase project configuration.

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

### Docker Setup

You can also run the app using Docker and Docker Compose:

1. **Build and start**:
   ```bash
   docker-compose up --build
   ```
   The app will be available at `http://localhost:3000`.

## 🔒 Security & Privacy

- **Application Passwords**: We recommend using WordPress Application Passwords for secure API access.
- **Data Privacy**: Your WordPress credentials are never stored on our servers; they are used only for direct API calls from your browser (or via the proxy).
- **Audit Trail**: Every AI action is logged in the Activity Log for your review.

## 📄 License & Attribution

This project is licensed under the **MIT License**.

### ⚠️ Attribution Requirement
If you use this product, tool, or codebase for **personal, business, commercial, or enterprise** purposes, you **MUST** give credit to the **WP Sentinel AI Team**. 

Please include a visible "Powered by WP Sentinel AI Team" or similar mention in your product's "About" section, documentation, or footer.

## ☁️ Cloud & Enterprise

For enterprise or business use cases requiring managed hosting, team collaboration, and advanced security, we offer a Cloud version. Please contact us for more information.

---

*Disclaimer: This tool is intended for educational and professional use. Always ensure you have proper authorization before performing audits or modifications on any WordPress site.*
