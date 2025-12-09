import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    describeImage(file: any): Promise<{
        objects: ({
            label: string;
            confidence: number;
            bounding_box: number[];
            text?: undefined;
        } | {
            label: string;
            confidence: number;
            text: string;
            bounding_box?: undefined;
        })[];
        summary: string;
    }>;
    detectPain(file: any): Promise<{
        pain_level: number;
        emotion: string;
        confidence: number;
    }>;
    processVoice(text: string): Promise<{
        intent: string;
        action: {
            type: string;
            priority: string;
        };
        response: string;
    } | {
        intent: string;
        action: {
            type: string;
            priority?: undefined;
        };
        response: string;
    } | {
        intent: string;
        response: string;
        action?: undefined;
    }>;
}
