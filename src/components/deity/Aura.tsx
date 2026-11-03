import { cn } from '../../lib/cn';

interface AuraProps {
  className?: string;
  /** Core → mid → edge colours of the glow. */
  colors?: readonly [string, string, string];
  rays?: boolean;
  /** Colour of the turning rays. */
  rayColor?: string;
}

/**
 * Soft divine halo: layered radial glow plus slowly turning rays. Pure CSS gradients.
 * Breathing/turning come from the `.aura-glow` / `.aura-rays` keyframes, which run on
 * the compositor while the enclosing scene has data-idle="on".
 */
export function Aura({
  className,
  colors = ['rgb(255 248 224)', 'rgb(246 226 168 / 0.8)', 'rgb(232 213 163 / 0)'],
  rays = true,
  rayColor = 'rgb(201 162 39 / 0.16)',
}: AuraProps) {
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute', className)}>
      {rays && (
        <div
          className="aura-rays absolute inset-[-18%] rounded-full opacity-80"
          style={{
            background: `repeating-conic-gradient(from 0deg, ${rayColor} 0deg 1.6deg, transparent 1.6deg 9deg)`,
            WebkitMaskImage: 'radial-gradient(closest-side, #000 35%, transparent 100%)',
            maskImage: 'radial-gradient(closest-side, #000 35%, transparent 100%)',
          }}
        />
      )}
      <div
        className="aura-glow absolute inset-0 rounded-full opacity-85"
        style={{
          background: `radial-gradient(closest-side, ${colors[0]} 0%, ${colors[1]} 42%, ${colors[2]} 100%)`,
        }}
      />
    </div>
  );
}
