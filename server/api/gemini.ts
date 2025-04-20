// ~/server/api/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  
  if (!config.geminiApiKey) {
    throw createError({
      statusCode: 500,
      message: 'API キーが設定されていません'
    });
  }

  const body = await readBody(event);
  if (!body.prompt) {
    throw createError({
      statusCode: 400,
      message: 'プロンプトが必要です'
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(config.geminiApiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0,
        maxOutputTokens: 1
      }
    });

    const prompt = `
以下の文の感情を判別してください。感情は「喜」「怒」「哀」「楽」の4つです。

出力ルール：
- 喜は「1」
- 怒は「2」
- 哀は「3」
- 楽は「4」
- 感情が読み取れない場合は「5」

1文字の数字だけを返してください。

分析対象：「${body.prompt}」`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // 1-5 の数字のみを許可
    const validated = /^[1-5]$/.test(text) ? text : "5";

    return { text: validated };
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw createError({
      statusCode: 500,
      message: 'APIの呼び出し中にエラーが発生しました'
    });
  }
});
