
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const generateContent = async (prompt: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a list of Chinese words or phrases related to the topic: "${prompt}". 
      Return the result as a simple array of strings. 
      For each character that is slightly complex or good for practice, occasionally mark it with an asterisk * to indicate it should be a tracing character.
      Keep it between 10-20 words/phrases.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const text = response.text;
    if (text) {
      return JSON.parse(text);
    }
    return [];
  } catch (error) {
    console.error("Gemini generation error:", error);
    return [];
  }
};
