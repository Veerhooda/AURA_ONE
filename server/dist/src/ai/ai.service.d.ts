export declare class AiService {
    processImage(imageBuffer: Buffer): Promise<{
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
    detectPain(imageBuffer: Buffer): Promise<{
        pain_level: number;
        emotion: string;
        confidence: number;
    }>;
}
