import { defineConfig, type HtmlTagDescriptor, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { wedding } from './src/data/config.ts';

/** Injects <title>, description, OpenGraph and Twitter tags from src/data/config.ts. */
function inviteMeta(): Plugin {
  const { site } = wedding;
  const ogImage = new URL(site.ogImage, site.url).toString();
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const { bride, groom } = wedding.couple;
  // Names painted by the static boot screen before any JS runs.
  const bootNames = `${escape(bride.firstName)} <i>&amp;</i> ${escape(groom.firstName)}`;
  const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({
    tag: 'meta',
    attrs,
    injectTo: 'head',
  });
  return {
    name: 'invite-meta',
    transformIndexHtml(html) {
      return {
        html: html
          .replace(/<title>.*<\/title>/, `<title>${site.title}</title>`)
          .replace('<!--boot-names-->', bootNames),
        tags: [
          meta({ name: 'description', content: site.description }),
          meta({ property: 'og:type', content: 'website' }),
          meta({ property: 'og:url', content: site.url }),
          meta({ property: 'og:title', content: site.title }),
          meta({ property: 'og:description', content: site.description }),
          meta({ property: 'og:image', content: ogImage }),
          meta({ property: 'og:image:width', content: '1200' }),
          meta({ property: 'og:image:height', content: '630' }),
          meta({ property: 'og:locale', content: site.locale }),
          meta({ name: 'twitter:card', content: 'summary_large_image' }),
          meta({ name: 'twitter:title', content: site.title }),
          meta({ name: 'twitter:description', content: site.description }),
          meta({ name: 'twitter:image', content: ogImage }),
        ],
      };
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inviteMeta()],
  // Port 3000 matches the threejs-devtools MCP DEV_PORT in .mcp.json.
  server: { port: 3000 },
  preview: { port: 4173 },
  build: {
    target: ['es2021', 'safari15', 'chrome100', 'firefox100'],
    // Three.js lives in its own lazily loaded chunk; keep the warning meaningful.
    chunkSizeWarningLimit: 1000,
  },
});
