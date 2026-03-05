import React from 'react';
import { motion } from 'framer-motion';
import { KRACKED_COLORS } from '../../constants/theme';

const SkillCard = ({ icon: Icon, title, skill, onHover, isHovered, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
        onMouseEnter={() => onHover(skill)}
        onMouseLeave={() => onHover(null)}
        style={{
            padding: '12px',
            background: isHovered ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.4)',
            border: isHovered
                ? `2px solid ${KRACKED_COLORS.accentYellow}`
                : '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: '"Press Start 2P", monospace',
            position: 'relative',
            textAlign: 'center'
        }}
        whileHover={{ scale: 1.05 }}
    >
        <div style={{
            width: '32px',
            height: '32px',
            margin: '0 auto 10px',
            background: isHovered ? KRACKED_COLORS.accentYellow : 'rgba(255,255,255,0.1)',
            display: 'grid',
            placeItems: 'center',
            color: isHovered ? '#000' : KRACKED_COLORS.accentYellow
        }}>
            <Icon size={16} />
        </div>
        <div>
            <div style={{
                fontSize: '8px',
                fontWeight: 900,
                color: isHovered ? KRACKED_COLORS.accentYellow : '#fff',
                marginBottom: '6px',
                lineHeight: 1.4
            }}>
                {title}
            </div>
            {isHovered && (
                <div style={{
                    fontSize: '6px',
                    color: 'rgba(255,255,255,0.6)',
                    textTransform: 'uppercase'
                }}>
                    {skill}
                </div>
            )}
        </div>
        {isHovered && (
            <div style={{
                position: 'absolute',
                inset: -2,
                border: `1px solid ${KRACKED_COLORS.accentYellow}`,
                pointerEvents: 'none'
            }} />
        )}
    </motion.div>
);

export default SkillCard;

