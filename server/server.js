const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { CohereClientV2 } = require("cohere-ai");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = 5000;

// Initialize Cohere Client
const cohere = new CohereClientV2({
  apiKey: process.env.CO_API_KEY, // Using environment variable
});
console.log("CO_API_KEY:", process.env.CO_API_KEY);

app.post("/api/mood", async (req, res) => {
  const { mood, description } = req.body;

  try {
    // Call the Cohere chat API
    const response = await cohere.chat({
      model: "command-r-plus-08-2024",
      messages: [
        {
          role: "user",
          content: `The user feels a mood level of ${mood} out of 5. Here's their description: "${description}". Provide personalized insights, advice, or tips to help them understand their mood and improve it.`,
        },
      ],
    });

    console.log(response);

    if (
      response &&
      response.message &&
      Array.isArray(response.message.content) &&
      response.message.content.length > 0
    ) {
      const insights = response.message.content[0].text.trim();
      res.json({ insights });
    } else {
      res
        .status(500)
        .json({
          error: "Unexpected API response format or no insights generated.",
        });
    }
  } catch (error) {
    console.error(
      "Error communicating with Cohere:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to fetch insights." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
