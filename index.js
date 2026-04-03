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
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

client.on("ready", () => {
  console.log(`✅ Bot online as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith("!ask")) {
    const prompt = message.content.slice(5);

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;

      message.reply(response.text());
    } catch (error) {
      console.error(error);
      message.reply("❌ Error aaya bro");
    }
  }
});

client.login(process.env.DISCORD_TOKEN);