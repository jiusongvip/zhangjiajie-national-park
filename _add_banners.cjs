const fs = require('fs');
const path = require('path');

const pages = {
  'guide.astro': { banner: 'banner-guide', alt: 'Panoramic sandstone pillars of Zhangjiajie National Forest Park' },
  'attractions.astro': { banner: 'banner-attractions', alt: 'Green valley surrounded by majestic Zhangjiajie mountains' },
  'tianmen-mountain.astro': { banner: 'banner-tianmen', alt: "Tianmen Mountain with Heaven's Gate natural stone arch" },
  'avatar-mountains.astro': { banner: 'banner-avatar', alt: 'Avatar Hallelujah Mountain sandstone pillar rising above forest' },
  'glass-bridge.astro': { banner: 'banner-glassbridge', alt: 'Zhangjiajie Glass Bridge suspended above Grand Canyon' },
  'hiking-trails.astro': { banner: 'banner-hiking', alt: 'Sandstone rock formations in Zhangjiajie National Park forest' },
  'weather.astro': { banner: 'banner-weather', alt: 'Misty clouds wrapping around Zhangjiajie mountain peaks' },
  'best-time-to-visit.astro': { banner: 'banner-besttime', alt: 'Lush green rocky mountain landscape in Zhangjiajie' },
  'tickets.astro': { banner: 'banner-tickets', alt: 'Aerial view of Zhangjiajie National Park entrance area' },
  'how-to-get-there.astro': { banner: 'banner-transport', alt: 'Cable car gliding over Zhangjiajie mountain range' },
  'hotels.astro': { banner: 'banner-hotels', alt: 'Tianmen Mountain scenery near Wulingyuan accommodation' },
  'itinerary.astro': { banner: 'banner-itinerary', alt: 'Aerial panorama of Zhangjiajie for trip planning' },
  'photography.astro': { banner: 'banner-photography', alt: 'Misty Zhangjiajie peaks perfect for landscape photography' },
  'faq.astro': { banner: 'banner-faq', alt: 'Zhangjiajie sandstone pillars above lush green forest' },
  'food.astro': { banner: 'banner-food', alt: 'Traditional Chinese hot pot cuisine with fresh ingredients' },
  'compare.astro': { banner: 'banner-compare', alt: 'Dramatic Zhangjiajie landscape for destination comparison' },
  'fenghuang-ancient-town.astro': { banner: 'banner-fenghuang', alt: 'Fenghuang Ancient Town riverside at night' },
  'about.astro': { banner: 'banner-about', alt: 'Cable cars traveling through Zhangjiajie mountain scenery' }
};

const pagesDir = path.join(__dirname, 'src', 'pages');

for (const [file, info] of Object.entries(pages)) {
  const fp = path.join(pagesDir, file);
  if (!fs.existsSync(fp)) { console.log('SKIP: ' + file); continue; }

  let content = fs.readFileSync(fp, 'utf8');

  const bannerHTML =
`  <div class="mt-8 rounded-2xl overflow-hidden">
    <picture>
      <source srcset="/${info.banner}.webp" type="image/webp" />
      <img
        src="/${info.banner}.jpg"
        alt="${info.alt}"
        class="w-full aspect-[21/9] object-cover"
        width="1200"
        height="514"
        loading="eager"
        decoding="async"
      />
    </picture>
  </div>
`;

  // Find </nav> then <div class="mt-12 or mt-16
  const idx = content.indexOf('</nav>');
  if (idx === -1) { console.log('NO NAV: ' + file); continue; }

  const afterNav = content.substring(idx + 6);
  const divMatch = afterNav.match(/<div class="mt-1[26]/);
  if (!divMatch) { console.log('NO DIV: ' + file); continue; }

  const insertIdx = idx + 6 + divMatch.index;
  content = content.substring(0, insertIdx) + '\n' + bannerHTML + '\n    ' + content.substring(insertIdx);
  fs.writeFileSync(fp, content);
  console.log('OK: ' + file);
}
console.log('All done!');
