# Cognitive Language Learning Platform

An advanced language learning dashboard that uses real-time cognitive state tracking to optimize the learning experience. This platform monitors user engagement and automatically adjusts content difficulty and focus modules.


## 🛠️ Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd Cognitive-Language-Learning
```

### 2. Install Dependencies
```bash
npm install
npm install groq-sdk
```

### 3. Environment Setup
Create a `.env.local` file in the root directory and add your API keys:
```env
SARVAM_API_KEY=your_api_key_here
GROQ_API_KEY=your_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the results.

## 📊 Data Research
Session logs are saved automatically to the `cognitive_data/` directory in the project root whenever a session is completed or manually finished. These CSV files are designed for direct integration into machine learning pipelines.

## 🧪 Technologies
- **Frontend**: Next.js 15+ (App Router), React 19
- **Motion**: Framer Motion
- **Icons**: Lucide React
- **Language Analysis**: Compromise NLP
- **Styling**: Tailwind CSS 4+
