import type { CSSProperties, Ref } from 'react';
import { cn } from '../../lib/cn';
import { layerUrl } from './assets';
import type { DeityId, Pivot } from './types';

interface DeityLayerProps {
  deity: DeityId;
  name: string;
  pivot?: Pivot;
  optional?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLImageElement>;
}

/**
 * One full-artboard, transparent image layer. All layers share the same canvas size,
 * so they line up by simply stacking — exactly how a PSD/Procreate file is exported.
 */
export function DeityLayer({
  deity,
  name,
  pivot,
  optional,
  className,
  style,
  ref,
}: DeityLayerProps) {
  const src = layerUrl(deity, name);
  if (!src) {
    if (import.meta.env.DEV && !optional) {
      console.warn(`[deity] missing layer "${name}" in src/assets/deities/${deity}/`);
    }
    return null;
  }
  return (
    <img
      ref={ref}
      src={src}
      alt=""
      aria-hidden="true"
      draggable={false}
      decoding="async"
      data-layer={name}
      className={cn('pointer-events-none absolute inset-0 h-full w-full select-none', className)}
      style={{
        transformOrigin: pivot ? `${pivot[0] * 100}% ${pivot[1] * 100}%` : undefined,
        ...style,
      }}
    />
  );
}
