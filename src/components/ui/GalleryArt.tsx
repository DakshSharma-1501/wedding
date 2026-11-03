import { cn } from '../../lib/cn';
import type { GalleryItem } from '../../scenes/couple/photos';

/** A gallery photo, or — until real photos are added — an illustrated placeholder. */
export function GalleryArt({ item, large = false }: { item: GalleryItem; large?: boolean }) {
  if (item.src) {
    return (
      <img
        src={item.src}
        alt={item.caption}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover"
      />
    );
  }
  return (
    <div
      className={cn('relative grid h-full w-full place-items-center bg-gradient-to-br', item.tone)}
      role="img"
      aria-label={`${item.caption} (placeholder — add your photo)`}
    >
      <svg
        viewBox="-50 -50 100 100"
        className={cn('opacity-60', large ? 'w-1/3' : 'w-1/2')}
        aria-hidden="true"
        fill="none"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
          <path
            key={a}
            d="M0,-6 C8,-16 8,-30 0,-40 C-8,-30 -8,-16 0,-6 Z"
            transform={`rotate(${a})`}
            stroke="#8C6A12"
            strokeWidth="1.4"
            fill="rgb(255 255 255 / 0.35)"
          />
        ))}
        <circle r="6" fill="#8C6A12" fillOpacity="0.6" />
        <circle
          r="46"
          stroke="#8C6A12"
          strokeOpacity="0.4"
          strokeDasharray="0 6"
          strokeLinecap="round"
          strokeWidth="2"
        />
      </svg>
      <span className="absolute bottom-3 text-[0.58rem] tracking-[0.28em] text-gold-dark/80 uppercase">
        Your photo here
      </span>
    </div>
  );
}
