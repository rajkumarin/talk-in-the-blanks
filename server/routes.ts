import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/form-fields", async (req, res) => {
    const fields = await storage.getFormFields();
    res.json(fields);
  });

  app.post("/api/analyze-speech", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      const fields = await storage.getFormFields();
      const fieldDescriptions = fields.map(f => ({
        id: f.id,
        name: f.name,
        label: f.label,
      }));

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a form field matching expert. Analyze the given text and match it to the appropriate form fields. Return a JSON object with field names as keys and extracted values as values."
          },
          {
            role: "user",
            content: `Available fields: ${JSON.stringify(fieldDescriptions)}\n\nText to analyze: ${text}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing speech:", error);
      res.status(500).json({ error: "Failed to analyze speech" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
