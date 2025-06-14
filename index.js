
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { Configuration, OpenAIApi } = require("openai");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/api/suggest", async (req, res) => {
  const { resumeText } = req.body;
  try {
    const prompt = `Suggest improvements for the following resume:\n${resumeText}`;
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const suggestions = completion.data.choices[0].message.content;
    res.json({ suggestions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get AI suggestions" });
  }
});

app.get("/", (req, res) => {
  res.send("Smart Resume Builder Backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
