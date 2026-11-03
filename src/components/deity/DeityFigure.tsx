import type { CSSProperties, Ref } from 'react';
import { cn } from '../../lib/cn';
import { BlinkingEyes } from './BlinkingEyes';
import { DeityLayer } from './DeityLayer';
import type { DeityRig } from './types';

interface DeityFigureProps {
  rig: DeityRig;
  active: boolean;
  reducedMotion: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLDivElement>;
}

/**
 * Stacks a rig's layers back-to-front at the artboard's aspect ratio.
 * Scenes animate individual layers through their `data-layer` attribute.
 */
export function DeityFigure({
  rig,
  active,
  reducedMotion,
  className,
  style,
  ref,
}: DeityFigureProps) {
  return (
    <div
      ref={ref}
      role="img"
      aria-label={rig.label}
      className={cn('relative select-none', className)}
      style={{ aspectRatio: `${rig.artboard.width} / ${rig.artboard.height}`, ...style }}
    >
      {rig.layers.map((layer) =>
        layer === 'eyes' ? (
          rig.eyes ? (
            <BlinkingEyes
              key="eyes"
              deity={rig.id}
              rig={rig.eyes}
              active={active}
              reducedMotion={reducedMotion}
            />
          ) : null
        ) : (
          <DeityLayer
            key={layer.name}
            deity={rig.id}
            name={layer.name}
            pivot={layer.pivot}
            optional={layer.optional}
            className={layer.idle}
          />
        ),
      )}
    </div>
  );
}
