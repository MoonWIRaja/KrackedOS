import React from 'react';
import { getSpriteById } from '../../../constants/kdAcademySprites';

export default function KdPixelSprite({ spriteId = 'fighter-local', size = 96, label = '', frame = 0 }) {
  const sprite = getSpriteById(spriteId);
  const [frameW, frameH] = sprite.frameSize || [32, 32];
  const safeFrame = sprite.frameCount > 1 ? frame % sprite.frameCount : 0;

  if (sprite.frameCount > 1) {
    return (
      <div
        aria-label={label}
        title={label}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${sprite.src})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: `${frameW * sprite.frameCount * (size / frameW)}px ${frameH * (size / frameH)}px`,
          backgroundPosition: `-${safeFrame * size}px 0px`,
          imageRendering: 'pixelated',
          imageRenderingFallback: 'crisp-edges'
        }}
      />
    );
  }

  return (
    <img
      src={sprite.src}
      alt={label}
      title={label}
      style={{
        width: size,
        height: size,
        objectFit: 'contain',
        imageRendering: 'pixelated'
      }}
    />
  );
}
