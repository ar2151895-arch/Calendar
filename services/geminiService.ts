export class GeminiService {
  async sendMessage(prompt: string, context: string, year?: number): Promise<string> {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, context, year }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || 'क्षमा करें, उत्तर प्राप्त नहीं हो सका।';
    } catch (error) {
      console.error('Gemini Service Client Error:', error);
      return 'नमस्ते! सर्वर से जुड़ने में थोड़ी समस्या आई। कृपया थोड़ी देर बाद पुनः प्रयास करें।';
    }
  }

  async getFestivalDetails(festivalName: string, year: number): Promise<string> {
    try {
      const response = await fetch('/api/festival-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ festivalName, year }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.text || '';
    } catch (error) {
      console.error('Festival Info Client Error:', error);
      return '';
    }
  }
}

export const geminiService = new GeminiService();
