/** Colour washes for the dark "divine night" scenes (see SceneBackdrops). */
export const BACKDROPS = {
  peacock:
    'radial-gradient(ellipse 120% 85% at 50% 32%, #154D72 0%, #0B3C5D 30%, #072A42 62%, #041B2C 100%)',
  indigo:
    'radial-gradient(ellipse 110% 85% at 50% 38%, #262F72 0%, #18204F 38%, #0C3A44 78%, #06272D 100%)',
  dusk: 'linear-gradient(180deg, #0A1430 0%, #1B1942 36%, #43203F 68%, #7A3226 100%)',
} as const;

export type BackdropId = keyof typeof BACKDROPS;
