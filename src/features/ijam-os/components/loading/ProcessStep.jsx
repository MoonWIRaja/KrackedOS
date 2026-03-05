import React from 'react';
import { motion } from 'framer-motion';
import { KRACKED_COLORS } from '../../constants/theme';

const ProcessStep = ({ icon: Icon, title, description, isUnlocked, isActive, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{
            opacity: isUnlocked || isActive ? 1 : 0.4,
            x: 0
        }}
        transition={{ delay, duration: 0.3 }}
        style={{
            padding: '12px',
            border: isActive
                ? `2px solid ${KRACKED_COLORS.accentYellow}`
                : '1px solid rgba(255,255,255,0.1)',
            background: isActive
                ? 'rgba(245,208,0,0.15)'
                : isUnlocked
                    ? 'rgba(255,255,255,0.05)'
                    : 'transparent',
            marginBottom: '8px',
            fontFamily: '"Press Start 2P", monospace',
            position: 'relative'
        }}
    >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
                width: '32px',
                height: '32px',
                flexShrink: 0,
                background: isActive ? KRACKED_COLORS.accentYellow : 'rgba(255,255,255,0.1)',
                display: 'grid',
                placeItems: 'center',
                color: isActive ? '#000' : KRACKED_COLORS.accentYellow,
                border: '1px solid rgba(0,0,0,0.3)'
            }}>
                <Icon size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
                <div style={{
                    fontSize: '9px',
                    fontWeight: 900,
                    color: isActive ? KRACKED_COLORS.accentYellow : isUnlocked ? '#fff' : 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.05em'
                }}>
                    {title}
                </div>
                {isActive && (
                    <div style={{
                        fontSize: '7px',
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: '6px',
                        lineHeight: 1.4
                    }}>
                        {description}
                    </div>
                )}
            </div>
            {isUnlocked && !isActive && (
                <div style={{ marginLeft: 'auto', color: KRACKED_COLORS.accentGreen, fontSize: '12px' }}>✓</div>
            )}
        </div>
        {isActive && (
            <div style={{
                position: 'absolute',
                left: -4, top: 0, bottom: 0,
                width: '4px',
                background: KRACKED_COLORS.accentYellow,
                boxShadow: `0 0 10px ${KRACKED_COLORS.accentYellow}`
            }} />
        )}
    </motion.div>
);

export default ProcessStep;

