import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const apiKey = process.env.AZURE_OPENAI_API_KEY!;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT!;
    const deploymentName = process.env.AZURE_OPENAI_DEPLOYMENT_NAME!;

    console.log("=== Azure OpenAI REST API 테스트 ===");
    console.log("Endpoint:", endpoint);
    console.log("Deployment:", deploymentName);
    console.log("API Key 존재:", !!apiKey);
    console.log("================================");

    const apiVersion = "2024-02-15-preview";

const response = await fetch(
  `${endpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "안녕하세요. 테스트입니다." },
      ],
      max_tokens: 50,
      temperature: 0.1,
    }),
  }
);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
    }

    const result = await response.json();
    const content = result.choices[0]?.message?.content;

    res.status(200).json({
      success: true,
      message: "Azure OpenAI REST API 호출 성공!",
      response: content,
      details: {
        endpoint: endpoint,
        deployment: deploymentName,
        apiVersion: "2023-11-01",
        status: response.status,
        statusText: response.statusText
      }
    });
  } catch (err) {
    console.error("Azure OpenAI REST API 호출 실패:", err);
    res.status(500).json({ 
      success: false, 
      error: err instanceof Error ? err.message : String(err),
      message: "Azure OpenAI REST API 호출 중 오류가 발생했습니다."
    });
  }
}
