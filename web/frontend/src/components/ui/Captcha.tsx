import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface CaptchaHandle {
    refresh: () => void;
    validate: (input: string) => boolean;
}

interface CaptchaProps {
    onValidate?: (isValid: boolean) => void;
    className?: string;
}

const Captcha = forwardRef<CaptchaHandle, CaptchaProps>(({ onValidate, className }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captchaCode, setCaptchaCode] = useState('');

    useImperativeHandle(ref, () => ({
        refresh: generateCaptcha,
        validate: (input: string) => input.toUpperCase() === captchaCode
    }));

    const generateRandomChar = () => {
        const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed I, O for clarity
        return chars[Math.floor(Math.random() * chars.length)];
    };

    const generateCaptcha = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Generate Code
        let code = '';
        const charCount = 6;
        for (let i = 0; i < charCount; i++) {
            const char = generateRandomChar();
            code += char;
            
            // Random styling for each character
            ctx.save();
            ctx.translate(20 + i * 30, 30);
            ctx.rotate((Math.random() - 0.5) * 0.4);
            ctx.font = `bold ${24 + Math.random() * 8}px 'JetBrains Mono'`;
            ctx.fillStyle = `rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${255}, 0.8)`;
            ctx.fillText(char, 0, 0);
            ctx.restore();
        }
        setCaptchaCode(code);

        // Add Noise (Lines)
        for (let i = 0; i < 7; i++) {
            ctx.beginPath();
            ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
            ctx.lineWidth = 1 + Math.random();
            ctx.stroke();
        }

        // Add Noise (Dots)
        for (let i = 0; i < 50; i++) {
            ctx.beginPath();
            ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, 1, 0, 2 * Math.PI);
            ctx.fillStyle = `rgba(255, 255, 255, ${0.1 + Math.random() * 0.2})`;
            ctx.fill();
        }
        
        if (onValidate) onValidate(false); 
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <canvas 
                ref={canvasRef} 
                width={200} 
                height={60} 
                className="rounded-lg border border-white/10 bg-slate-900/50 cursor-pointer"
                onClick={generateCaptcha}
                title="Click to refresh"
            />
            <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={generateCaptcha}
                className="text-slate-400 hover:text-white"
            >
                <RefreshCw className="w-5 h-5" />
            </Button>
        </div>
    );
});

Captcha.displayName = "Captcha";
export default Captcha;
