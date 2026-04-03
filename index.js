import { Client, GatewayIntentBits } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ✅ UPDATED MODEL (working)
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// ✅ FIXED EVENT NAME
client.on("clientReady", () => {
  console.log(`✅ Bot online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!ask")) {
    const prompt = message.content.slice(5).trim();

    if (!prompt) {
      return message.reply("❌ Kuch toh likh bhai after !ask");
    }

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      message.reply(text || "⚠️ Empty response aaya");
    } catch (error) {
      console.error("Gemini Error:", error);
      message.reply("❌ AI error aa gaya bro, baad me try kar");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
