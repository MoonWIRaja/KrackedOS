import React, { useState, useEffect, useRef } from 'react';

const IjamBotMascot = ({ size = 48, mousePos, emotion = 'neutral' }) => {
    const [isBlinking, setIsBlinking] = useState(false);
    const [currentEmotion, setCurrentEmotion] = useState(emotion);
    const blinkTimerRef = useRef(null);
    const emotionTimerRef = useRef(null);

    const calculateEyePosition = (nextMousePos, nextSize) => {
        if (!nextMousePos) return { x: 0, y: 0 };

        const eyeOffset = nextSize * 0.05;
        const x = (nextMousePos.x / window.innerWidth - 0.5) * eyeOffset;
        const y = (nextMousePos.y / window.innerHeight - 0.5) * eyeOffset;

        return { x, y };
    };

    const eyePos = calculateEyePosition(mousePos, size);

    useEffect(() => {
        const blink = () => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 100);
        };

        const scheduleBlink = () => {
            const interval = Math.random() * 6000 + 2000;
            blinkTimerRef.current = setTimeout(() => {
                blink();
                scheduleBlink();
            }, interval);
        };

        scheduleBlink();

        return () => {
            if (blinkTimerRef.current) {
                clearTimeout(blinkTimerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (emotion !== currentEmotion) {
            setCurrentEmotion(emotion);

            if (emotionTimerRef.current) {
                clearTimeout(emotionTimerRef.current);
            }

            emotionTimerRef.current = setTimeout(() => {
                setCurrentEmotion('neutral');
            }, 3000);
        }

        return () => {
            if (emotionTimerRef.current) {
                clearTimeout(emotionTimerRef.current);
            }
        };
    }, [emotion, currentEmotion]);

    const getMouthShape = (nextEmotion) => {
        switch (nextEmotion) {
            case 'happy':
                return 'M 10 70 Q 20 80 30 70';
            case 'excited':
                return 'M 5 70 Q 20 85 35 70';
            case 'thinking':
                return 'M 10 65 Q 20 60 30 65';
            case 'confused':
                return 'M 10 75 Q 20 65 30 75';
            case 'sleepy':
                return 'M 15 70 L 25 70';
            case 'sad':
                return 'M 10 75 Q 20 65 30 75';
            case 'frustrated':
                return 'M 8 78 Q 20 72 32 78';
            case 'motivated':
                return 'M 8 68 Q 20 78 32 68';
            case 'celebrating':
                return 'M 5 65 Q 20 85 35 65';
            case 'surprised':
                return 'M 14 70 Q 20 75 26 70';
            case 'bored':
                return 'M 12 72 L 28 72';
            case 'focused':
                return 'M 10 70 Q 20 73 30 70';
            default:
                return 'M 10 70 Q 20 75 30 70';
        }
    };

    const getEyeShape = (nextEmotion, blinking) => {
        if (blinking) {
            return 'M 10 40 L 20 40';
        }

        switch (nextEmotion) {
            case 'excited':
                return 'M 10 35 Q 15 30 20 35';
            case 'sleepy':
                return 'M 10 40 Q 15 42 20 40';
            case 'thinking':
                return 'M 10 38 Q 15 35 20 38';
            case 'frustrated':
                return 'M 10 42 L 20 38';
            case 'motivated':
                return 'M 10 36 Q 15 32 20 36';
            case 'celebrating':
                return 'M 10 35 Q 15 28 20 35';
            case 'surprised':
                return 'M 10 35 Q 15 30 20 35 Q 15 28 15 33';
            case 'bored':
                return 'M 10 40 Q 15 43 20 40';
            case 'focused':
                return 'M 10 37 Q 15 34 20 37';
            default:
                return 'M 10 38 Q 15 33 20 38';
        }
    };

    const getEyeColor = (nextEmotion) => {
        switch (nextEmotion) {
            case 'excited':
                return '#4ade80';
            case 'sleepy':
                return '#94a3b8';
            case 'thinking':
                return '#60a5fa';
            default:
                return '#1f2937';
        }
    };

    const getBodyColor = (nextEmotion) => {
        switch (nextEmotion) {
            case 'happy':
                return '#f59e0b';
            case 'excited':
                return '#22c55e';
            case 'sleepy':
                return '#64748b';
            case 'thinking':
                return '#60a5fa';
            case 'confused':
                return '#f97316';
            case 'sad':
                return '#3b82f6';
            case 'frustrated':
                return '#dc2626';
            case 'motivated':
                return '#10b981';
            case 'celebrating':
                return '#fbbf24';
            case 'surprised':
                return '#a855f7';
            case 'bored':
                return '#6b7280';
            case 'focused':
                return '#0ea5e9';
            default:
                return '#ef4444';
        }
    };

    return (
        <div
            style={{
                width: size,
                height: size,
                position: 'relative',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <svg
                width={size}
                height={size}
                viewBox="0 0 40 80"
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    transition: 'fill 0.3s ease'
                }}
            >
                <ellipse
                    cx="20"
                    cy="50"
                    rx="18"
                    ry="25"
                    fill={getBodyColor(currentEmotion)}
                    stroke="#1f2937"
                    strokeWidth="2"
                />

                <circle
                    cx="20"
                    cy="30"
                    r="18"
                    fill={getBodyColor(currentEmotion)}
                    stroke="#1f2937"
                    strokeWidth="2"
                />

                <circle cx="5" cy="25" r="5" fill={getBodyColor(currentEmotion)} stroke="#1f2937" strokeWidth="2" />
                <circle cx="35" cy="25" r="5" fill={getBodyColor(currentEmotion)} stroke="#1f2937" strokeWidth="2" />

                <path
                    d={getEyeShape(currentEmotion, isBlinking)}
                    stroke={getEyeColor(currentEmotion)}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    transform={`translate(${eyePos.x - 5}, ${eyePos.y})`}
                />
                <path
                    d={getEyeShape(currentEmotion, isBlinking)}
                    stroke={getEyeColor(currentEmotion)}
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                    transform={`translate(${eyePos.x + 5}, ${eyePos.y})`}
                />

                <path
                    d={getMouthShape(currentEmotion)}
                    stroke="#1f2937"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {['happy', 'excited'].includes(currentEmotion) && (
                    <>
                        <circle cx="8" cy="55" r="3" fill="#fecaca" opacity="0.6" />
                        <circle cx="32" cy="55" r="3" fill="#fecaca" opacity="0.6" />
                    </>
                )}

                {currentEmotion === 'excited' && (
                    <polygon
                        points="20,10 22,14 26,14 23,17 24,21 20,19 16,21 17,17 14,14 18,14"
                        fill="#fbbf24"
                        opacity="0.8"
                    />
                )}

                {currentEmotion === 'thinking' && (
                    <>
                        <circle cx="35" cy="5" r="3" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
                        <circle cx="42" cy="2" r="2" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
                        <circle cx="48" cy="0" r="1.5" fill="#ffffff" stroke="#1f2937" strokeWidth="1" />
                    </>
                )}
            </svg>
        </div>
    );
};

export default IjamBotMascot;
