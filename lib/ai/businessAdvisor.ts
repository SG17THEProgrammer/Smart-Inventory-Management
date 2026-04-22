export async function getBusinessAdvice(data: any) {
  const prompt = `
You are an AI inventory advisor.

Data:
${JSON.stringify(data)}

Analyze:

1. Cash flow health
2. Dead stock items
3. Fast-moving items
4. Stockout losses
5. What business is doing wrong
6. What to do next (clear steps)

Be practical and concise.
`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
    }),
  });

  const json = await res.json();

  return json.choices[0].message.content;
}