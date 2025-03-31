# Leftover Recipe Suggester

A Next.js application that helps you find creative recipes based on the vegetables you have in your fridge. Simply upload a photo of your vegetables, and the app will identify them and suggest delicious recipes.

## Features

- Image upload for vegetable identification
- AI-powered vegetable recognition using Google's Gemini AI
- Recipe suggestions based on identified vegetables
- Calorie information for each recipe
- Responsive design for all devices

## Tech Stack

- Next.js 14
- TypeScript
- Google Gemini AI API
- CSS Modules

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/leftover-recipe-suggester.git
cd leftover-recipe-suggester
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your Google AI API key:
```
GOOGLE_AI_API_KEY=your_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

- `GOOGLE_AI_API_KEY`: Your Google AI API key for Gemini AI

## License

MIT
