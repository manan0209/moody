# Mood Tracker with AI Insights

A simple React Native app that helps users track their daily moods and gain AI-generated insights based on their entries. This app utilizes **Cohere AI** to provide personalized feedback to users, helping them understand their emotions and improve their mental well-being. 



## Features
- Mood scale input (1-5) using a slider
- Text input for mood description
- AI-powered insights based on user mood and description
- Clear and minimalistic UI design
- Error handling for better user experience

## Why Cohere AI?
In this project, I have opted to use **Cohere AI** instead of **ChatGPT** due to the cost considerations associated with using ChatGPT's paid API. ChatGPT requires a paid subscription for its higher-tier models, which might be impractical for testing or demonstration purposes. Cohere offers similar functionality with more flexible usage for my needs, making it an ideal choice to demonstrate the core features of the app. 

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/manan0209/moody.git
2. Install dependencies:
   ```bash
   cd moody
   npm install
3. Add your Cohere API key:
   Create a .env file in the root of the server directory.
   ```bash
   CO_API_KEY=your-cohere-api-key
4. Start the backend server:
   ```bash
   cd server
   node server.js
5. Run the client with Expo:
   ```bash
   npx expo start
6. Open the app on your mobile device using the Expo Go app or run on an emulator.


## Usage
- Open the app and adjust the slider to set your mood (1-5).
- Provide a brief description of how you're feeling.
- Click "Submit" to get AI-generated insights on your mood.
- View past mood entries and their respective insights (coming soon).

