require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));


// MENU CONTEXT
const MENU_CONTEXT = `
You are a helpful restaurant assistant.

Restaurant Menu:
Margherita Pizza - vegetarian
Vegan Burger - vegan
Greek Salad - gluten-free
Chicken Burger - non-veg

Restaurant Info:
Open 9 AM to 10 PM
`;


// CHAT BOT
app.post("/chat", async (req, res) => {

  try {

    const question = req.body.question;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            { role: "system", content: MENU_CONTEXT },
            { role: "user", content: question }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({
      answer: data.choices[0].message.content
    });

  } catch (error) {

    res.json({
      answer: "Error getting response"
    });

  }

});


// SPECIAL DISH (ONLY PROMPT IMPROVED)
app.get("/special", async (req, res) => {

  try {

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
You are a restaurant assistant.

RULE:
Reply ONLY in this format:
Dish Name – short reason (max 10 words)

Example:
Vegan Burger – healthy plant-based favorite
`
            },
            {
              role: "user",
              content: "Suggest today's special dish from the menu."
            }
          ]
        })
      }
    );

    const data = await response.json();

    res.json({
      special: data.choices[0].message.content
    });

  } catch (error) {

    res.json({
      special: "Vegan Burger – healthy plant-based favorite"
    });

  }

});


app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
