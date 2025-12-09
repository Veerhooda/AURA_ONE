import { Injectable } from '@nestjs/common';

@Injectable()
export class AiService {
  async processImage(imageBuffer: Buffer) {
    // Stub: Real implementation would send to Python/Flask microservice or Cloud Vision API
    return {
      objects: [
        { label: 'medication_bottle', confidence: 0.95, bounding_box: [10, 10, 200, 200] },
        { label: 'text_label', confidence: 0.99, text: "Metformin 500mg" }
      ],
      summary: "I see a medication bottle labeled Metformin 500mg."
    };
  }

  async processVoice(text: string) {
    // Stub: Real app would use NLU (Dialogflow/Rasa)
    const lower = text.toLowerCase();
    if (lower.includes('nurse')) {
      return { intent: 'CALL_NURSE', action: { type: 'create_task', priority: 'high' }, response: "Calling the nurse now." };
    }
    if (lower.includes('medicine') || lower.includes('pill')) {
       return { intent: 'CHECK_SCHEDULE', action: { type: 'query_db' }, response: "Your next medication is at 2 PM." };
    }
    return { intent: 'GENERAL_QUERY', response: "I'm not sure, but I can ask the doctor." };
  }

  async detectPain(imageBuffer: Buffer) {
     return {
         pain_level: Math.floor(Math.random() * 3) + 1, // Simulate low pain
         emotion: 'neutral',
         confidence: 0.85
     };
  }
}
