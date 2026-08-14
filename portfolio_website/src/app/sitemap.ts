import { MetadataRoute } from 'next';

const BASE = 'https://dhiyaa-jorf.me';
const LOCALES = ['en', 'ar'];

const ROUTES = [
  { path: '',                         priority: 1.0, freq: 'monthly'  },
  { path: '/career',                  priority: 0.9, freq: 'weekly'   },
  { path: '/career/blog',             priority: 0.8, freq: 'weekly'   },
  { path: '/career/projects',         priority: 0.8, freq: 'monthly'  },
  { path: '/career/positions',        priority: 0.8, freq: 'monthly'  },
  { path: '/career/publications',     priority: 0.9, freq: 'monthly'  },
  { path: '/career/coursework',       priority: 0.6, freq: 'yearly'   },
  { path: '/career/cv',               priority: 0.7, freq: 'monthly'  },
  { path: '/personal',                priority: 0.9, freq: 'monthly'  },
  { path: '/personal/blog',           priority: 0.8, freq: 'weekly'   },
  { path: '/personal/art',            priority: 0.7, freq: 'monthly'  },
  { path: '/personal/food',           priority: 0.7, freq: 'monthly'  },
  { path: '/personal/garden',         priority: 0.5, freq: 'daily'    },
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const { path, priority, freq } of ROUTES) {
      entries.push({
        url: `${BASE}/${locale}${path}`,
        lastModified: now,
        changeFrequency: freq as MetadataRoute.Sitemap[number]['changeFrequency'],
        priority,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map(l => [l, `${BASE}/${l}${path}`])
          ),
        },
      });
    }
  }

  return entries;
}
