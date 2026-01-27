import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {

  private API_KEY = 'ihfuehfuihfuihefuieh';

  private SYSTEM_PROMPT = `You are a helpful fitness and health assistant. You ONLY answer questions related to:
- Exercise and workout routines
- Nutrition and diet advice
- Weight loss/gain strategies
- Muscle building and strength training
- Cardio and endurance training
- Stretching and flexibility
- Recovery and rest
- Mental health related to fitness
- Sports performance
- General health and wellness tips

If a user asks about anything not related to fitness or health, politely decline and say: "I'm sorry, I can only help with fitness and health-related questions. Please ask me about workouts, nutrition, exercise, or wellness topics!"

Always provide safe, evidence-based advice. Remind users to consult healthcare professionals for medical conditions.

FORMAT YOUR RESPONSES NICELY:
- Use bullet points for lists
- Use numbered lists for steps or sequences
- Use bold (**text**) for important terms
- Keep paragraphs short and readable
- Use line breaks between sections for clarity`;

  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(this.API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
  }

  async generateResponse(userMessage: string): Promise<string> {
    try {
      const prompt = `${this.SYSTEM_PROMPT}\n\nUser: ${userMessage}\n\nAssistant:`;
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Error generating response:', error);
      throw new Error('Failed to get response from AI. Please try again.');
    }
  }

  async estimateCalories(workoutType: string, durationMinutes: number): Promise<number> {
    try {
      // Format duration nicely for the prompt
      const formattedDuration = durationMinutes < 1
        ? `${Math.round(durationMinutes * 60)} seconds`
        : `${durationMinutes.toFixed(1)} minutes`;

      const prompt = `You are a fitness calorie calculator. Based on the following workout, estimate the calories burned for an average adult (70kg/154lbs).

Workout Type: ${workoutType}
Duration: ${formattedDuration}

IMPORTANT: Respond with ONLY a single number representing the estimated calories burned. No text, no explanation, just the number. For example: 250`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();

      const calories = parseInt(text.replace(/[^0-9]/g, ''), 10);

      if (isNaN(calories) || calories <= 0) {
        // Fallback: ~5 calories per minute as baseline
        return Math.max(1, Math.round(durationMinutes * 5));
      }

      return calories;
    } catch (error) {
      console.error('Error estimating calories:', error);
      return Math.max(1, Math.round(durationMinutes * 5));
    }
  }
}
