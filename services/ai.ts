import axios from "axios";

export async function getAIInsight(data: any) {

const prompt = `
You are an expert inventory analyst.

Analyze:
${JSON.stringify(data)}

Respond with:
1. Demand trend (increasing/decreasing/stable)
2. Estimated stockout time
3. Risk level (low/medium/high)
4. Clear action (how many units to reorder)

Keep it brief and concise , to the point and practical.
`;

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: "You are a smart inventory assistant." },
        { role: "user", content: prompt },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
    }
  );

  return response.data.choices[0].message.content;
}