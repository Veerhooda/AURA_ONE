import React, { useState, useRef, useEffect } from 'react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Send, User, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'doctor';
    timestamp: string;
}

const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: 'Hello, I wanted to ask about the feedback from the morning rounds.', sender: 'user', timestamp: '10:30 AM' },
        { id: '2', text: 'Hi! The patient is recovering well. Vitals are stable and we are monitoring the temperature closely.', sender: 'doctor', timestamp: '10:45 AM' },
        { id: '3', text: 'That is great news. When can we visit?', sender: 'user', timestamp: '10:46 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim()) return;

        const msg: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: 'user',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages([...messages, msg]);
        setNewMessage('');

        // Simulate doctor response
        setTimeout(() => {
            const reply: Message = {
                id: (Date.now() + 1).toString(),
                text: "I'll check on that and let you know shortly.",
                sender: 'doctor',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, reply]);
        }, 2000);
    };

    return (
        <GlassPanel className="flex flex-col h-[600px] p-0 overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                            <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900"></div>
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">Dr. Sarah Wilson</h3>
                        <p className="text-xs text-emerald-400 font-medium">Online • Cardiology</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <Phone className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <Video className="w-4 h-4" />
                    </Button>
                    <div className="h-4 w-px bg-white/10 mx-1" />
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-slate-400 hover:text-white">
                        <MoreVertical className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={msg.id} 
                        className={cn(
                            "flex",
                            msg.sender === 'user' ? "justify-end" : "justify-start"
                        )}
                    >
                        <div className={cn(
                            "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm",
                            msg.sender === 'user' 
                                ? "bg-primary/20 text-white rounded-tr-none border border-primary/20" 
                                : "bg-slate-800 text-slate-200 rounded-tl-none border border-white/5"
                        )}>
                            <p>{msg.text}</p>
                            <p className={cn(
                                "text-[10px] mt-1 text-right opacity-70",
                                msg.sender === 'user' ? "text-primary-foreground" : "text-slate-400"
                            )}>{msg.timestamp}</p>
                        </div>
                    </motion.div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white/5 border-t border-white/10 flex gap-2">
                <Button type="button" variant="ghost" className="px-2 text-slate-400 hover:text-white">
                    <Paperclip className="w-5 h-5" />
                </Button>
                <Input 
                    placeholder="Type a message..." 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-slate-950/50 border-white/10 focus:border-primary/50"
                />
                <Button type="submit" disabled={!newMessage.trim()} className="shadow-none bg-primary hover:bg-primary/90 text-white">
                    <Send className="w-4 h-4" />
                </Button>
            </form>
        </GlassPanel>
    );
};

export default ChatInterface;
