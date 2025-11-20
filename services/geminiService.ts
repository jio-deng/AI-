import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Message, Scenario, TurnResult } from "../types";

const apiKey = process.env.API_KEY;
// Determine the model to use. Using flash for speed and low latency which is crucial for a game.
// gemini-2.5-flash is excellent for this roleplay logic.
const MODEL_NAME = "gemini-2.5-flash";

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

// Define the JSON schema for the game engine response
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    text: {
      type: Type.STRING,
      description: "The in-character response from the AI role (IN CHINESE).",
    },
    scoreDelta: {
      type: Type.INTEGER,
      description: "The change in persuasion score (-15 to +15) based on the user's latest argument quality.",
    },
    aiMood: {
      type: Type.STRING,
      description: "One word describing the AI's current emotion (e.g. Angry, Impressed, Skeptical, Happy) IN CHINESE.",
    },
    feedback: {
      type: Type.STRING,
      description: "A very short (max 10 words) out-of-character hint or observation about the user's move IN CHINESE.",
    },
    isGameOver: {
      type: Type.BOOLEAN,
      description: "True if the conversation has naturally reached a conclusion (either success or total failure).",
    },
    isWin: {
      type: Type.BOOLEAN,
      description: "True ONLY if the user has definitively achieved their goal within the narrative.",
    },
  },
  required: ["text", "scoreDelta", "aiMood", "isGameOver", "isWin"],
};

export const generateTurn = async (
  scenario: Scenario,
  history: Message[],
  currentScore: number
): Promise<TurnResult> => {
  if (!apiKey) {
    return {
      text: "API Key 缺失。请检查配置。",
      scoreDelta: 0,
      aiMood: "错误",
      isGameOver: false,
      isWin: false,
    };
  }

  // 1. Calculate Game State Metrics for Strategy
  const userTurns = history.filter(m => m.role === 'user').length;
  const turnsLeft = scenario.turnLimit - userTurns;
  
  // Momentum: Sum of score changes from the last 2 AI turns.
  // If near 0, the negotiation is stalled.
  const recentAiMsgs = history.filter(m => m.role === 'ai' && m.scoreDelta !== undefined).slice(-2);
  const momentum = recentAiMsgs.reduce((sum, msg) => sum + (msg.scoreDelta || 0), 0);
  
  // 2. Determine Dynamic Strategy
  let strategyName = "STANDARD";
  let strategyDirective = "Respond naturally to the user's points. Evaluate logic fairly.";

  if (currentScore >= scenario.winningScore) {
      strategyName = "CONCEDE";
      strategyDirective = "The user has persuaded you. Agree to the deal enthusiastically. Finalize the agreement.";
  } else if (turnsLeft <= 1) {
      strategyName = "FINAL_STAND";
      strategyDirective = "This is the LAST turn. If the user's argument is convincing and score is near the goal, ACCEPT. Otherwise, REJECT firmly and end the negotiation.";
  } else if (turnsLeft <= 3 && currentScore < scenario.winningScore * 0.6) {
      strategyName = "PRESSURE";
      strategyDirective = "Time is running out and the user is failing. Be strict, impatient, and threaten to walk away unless a major concession is made.";
  } else if (Math.abs(momentum) <= 4 && userTurns >= 2 && currentScore < scenario.winningScore - 10) {
      strategyName = "STALEMATE_BREAKER";
      strategyDirective = "The negotiation is stuck (stagnant score). Propose a specific compromise, counter-offer, or alternative solution to break the deadlock. Be constructive but firm.";
  } else if (currentScore < scenario.baseScore && userTurns >= 2) {
      strategyName = "DOMINANT";
      strategyDirective = "You have the upper hand. The user is performing poorly. Be dismissive, skeptical, and make them work harder to win back your interest.";
  } else if (currentScore > scenario.winningScore - 15) {
      strategyName = "CLOSING";
      strategyDirective = "The user is very close to the goal. Show you are wavering. Ask for one final small assurance or detail before agreeing.";
  }

  const historyText = history
    .map((m) => `${m.role === "user" ? "玩家" : scenario.aiRole}: ${m.content}`)
    .join("\n");

  const systemPrompt = `
    You are a roleplay game engine. 
    You are playing the role of: ${scenario.aiRole}.
    The user is playing: ${scenario.userRole}.
    
    --- SCENARIO INFO ---
    SCENARIO: ${scenario.description}
    USER GOAL: ${scenario.goal}
    
    --- GAME STATE ---
    CURRENT PERSUASION SCORE: ${currentScore}/100
    WINNING SCORE NEEDED: ${scenario.winningScore}
    TURNS REMAINING: ${turnsLeft}
    
    --- STRATEGY INSTRUCTION ---
    ACTIVE STRATEGY: **${strategyName}**
    DIRECTIVE: ${strategyDirective}
    
    --- RULES ---
    1. **IMPORTANT**: YOU MUST SPEAK CHINESE (Simplified Chinese).
    2. Adjust 'scoreDelta' based on argument quality (-15 to +15).
    3. If score reaches ${scenario.winningScore}, you MUST accept (Win).
    4. If turns run out (0 left) and score is below winning score, you MUST reject (Loss).
    5. Keep response concise (under 50 words).
    
    Output strictly in JSON matching the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `
        ${systemPrompt}

        --- CONVERSATION HISTORY ---
        ${historyText}
        ----------------------------
        
        Generate the next turn response in JSON.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8, // Creative for dialogue
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from AI");
    
    const data = JSON.parse(jsonText) as TurnResult;
    return data;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      text: "我现在无法理解你的意思。(AI Error)",
      scoreDelta: 0,
      aiMood: "困惑",
      isGameOver: false,
      isWin: false,
    };
  }
};