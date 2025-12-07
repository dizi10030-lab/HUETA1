import { GoogleGenAI } from "@google/genai";

const getGeminiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeSafetyImage = async (file: File, userDescription: string): Promise<string> => {
  try {
    const client = getGeminiClient();
    
    const imagePart = await fileToGenerativePart(file);
    
    const prompt = `
      Ты — высококвалифицированный эксперт по промышленной безопасности в Российской Федерации. 
      Твоя специализация — Федеральные нормы и правила (ФНП) в области промышленной безопасности.
      
      Задача:
      Проанализируй предоставленное изображение и текстовое описание на предмет нарушений требований ФНП.
      
      Описание от пользователя: "${userDescription}"
      
      Используй свои знания нормативной базы и, при необходимости, используй Google Search для поиска актуальных редакций документов на docs.cntd.ru или аналогичных правовых порталах.
      
      Важные правила анализа:
      1. Учитывай только факты, которые можно достоверно увидеть на фото. Текст пользователя — вспомогательный.
      2. Ссылайся на конкретные пункты действующих ФНП (название документа, пункт, подпункт).
      3. Будь строгим и объективным.
      
      Формат ответа должен быть строго следующим (используй Markdown):
      
      ## Анализ изображения
      Краткое техническое описание того, что видно на фото (оборудование, состояние, среда).
      
      ## Соответствие требованиям ФНП
      Перечисли пункты, которые относятся к данному оборудованию.
      
      ## Перечень нарушений
      Если нарушений нет, напиши "Нарушений визуально не выявлено".
      Если есть, используй формат:
      * **Нарушение:** [Суть нарушения]
      * **Пункт ФНП:** [Точное название документа и номер пункта]
      * **Пояснение:** [Почему это является нарушением]
      
      ## Рекомендации
      Список конкретных технических и организационных мер для устранения нарушений.
      
      ## Уровень риска
      **[Низкий / Средний / Высокий]**
      Обоснование уровня риска.
    `;

    // Using gemini-2.5-flash for speed and multimodal capabilities.
    // Added googleSearch tool to help look up specific FNP clauses if internal knowledge needs verification.
    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: prompt }
        ]
      },
      config: {
        temperature: 0.2, // Low temperature for more factual/analytical output
        tools: [{ googleSearch: {} }], 
      }
    });

    return response.text || "Не удалось получить ответ от модели.";
  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    if (error.message?.includes("API_KEY")) {
      throw new Error("Неверный или отсутствующий API ключ.");
    }
    throw new Error("Произошла ошибка при анализе изображения. Попробуйте еще раз.");
  }
};