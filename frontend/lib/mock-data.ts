import type { Template } from './types'

// Palette: [bg, border, accent, titleColor, bodyColor]
type Pal = [string, string, string, string, string]
// Title entry: [title, styleTags]
type TD = [string, string[]]
// Copy: [headline, namesOrHost, tagline, details, rsvp]
type CP = [string, string, string, string, string]

interface OccSpec {
  slug: string
  pals: Pal[]
  titles: TD[]
  copies: CP[]
  prices: number[]
}

// ─── Fabric JSON canvas builders ─────────────────────────────────────────────

function r(props: Record<string, unknown>) {
  return { type: 'rect', version: '5.5.2', originX: 'left', originY: 'top', rx: 0, ry: 0, selectable: false, ...props }
}
function l(x1: number, y1: number, x2: number, y2: number, stroke: string, sw = 1.5) {
  return { type: 'line', version: '5.5.2', x1, y1, x2, y2, stroke, strokeWidth: sw, selectable: false }
}
function t(cx: number, top: number, w: number, text: string, size: number, font: string, fill: string, opts: { bold?: boolean; italic?: boolean } = {}) {
  return { type: 'textbox', version: '5.5.2', originX: 'center', originY: 'top', left: cx, top, width: w, text, fontSize: size, fontFamily: font, fill, textAlign: 'center', ...(opts.bold ? { fontWeight: 'bold' } : {}), ...(opts.italic ? { fontStyle: 'italic' } : {}) }
}

const SF = 'Playfair Display'
const BF = 'Georgia'

// Layout 0: Classic Portrait 800×1100 — light bg, double border, elegant
function lay0(p: Pal, cp: CP): Record<string, unknown> {
  const [bg, border, accent, tc, bc] = p
  const [hl, names, tg, det, rsvp] = cp
  return { version: '5.5.2', background: bg, objects: [
    r({ left:0, top:0, width:800, height:1100, fill:bg, stroke:border, strokeWidth:10 }),
    r({ left:26, top:26, width:748, height:1048, fill:'transparent', stroke:accent, strokeWidth:1 }),
    l(100,108,700,108, accent, 2),
    t(400,128, 680, hl, 20, BF, bc, {italic:true}),
    t(400,195, 680, names, 52, SF, tc, {bold:true}),
    l(200,330, 600,330, accent),
    t(400,350, 660, tg, 18, BF, bc),
    t(400,560, 660, det, 22, BF, tc),
    l(200,870, 600,870, accent),
    t(400,890, 660, rsvp, 16, BF, bc),
    l(100,990, 700,990, accent, 2),
  ]}
}

// Layout 1: Dark Luxe Portrait 800×1100 — rich dark bg, light text
function lay1(p: Pal, cp: CP): Record<string, unknown> {
  const [, border, accent, tc, bc] = p
  // Use tc (dark) as bg, bg (light) as text for inversion
  const darkBg = tc
  const lightText = p[0]  // bg becomes text
  const [hl, names, tg, det, rsvp] = cp
  return { version: '5.5.2', background: darkBg, objects: [
    r({ left:0, top:0, width:800, height:1100, fill:darkBg, stroke:border, strokeWidth:8 }),
    l(80,98, 720,98, border, 2.5),
    t(400,120, 700, hl, 19, BF, accent, {italic:true}),
    t(400,185, 700, names, 55, SF, lightText, {bold:true}),
    l(160,335, 640,335, border, 2),
    t(400,355, 660, tg, 18, BF, accent),
    l(160,455, 640,455, border, 0.8),
    t(400,570, 660, det, 22, BF, lightText),
    l(220,855, 580,855, border),
    t(400,875, 660, rsvp, 16, BF, accent),
    l(80,975, 720,975, border, 2.5),
  ]}
}

// Layout 2: Modern Geometric Portrait 800×1100 — side bars, block accents
function lay2(p: Pal, cp: CP): Record<string, unknown> {
  const [bg, border, accent, tc, bc] = p
  const [hl, names, tg, det, rsvp] = cp
  return { version: '5.5.2', background: bg, objects: [
    r({ left:0, top:0, width:800, height:1100, fill:bg, stroke:bg, strokeWidth:0 }),
    r({ left:0, top:0, width:10, height:1100, fill:border }),
    r({ left:790, top:0, width:10, height:1100, fill:border }),
    r({ left:370, top:80, width:60, height:8, fill:border }),
    t(400,112, 680, hl, 19, BF, bc, {italic:true}),
    t(400,182, 680, names, 52, SF, tc, {bold:true}),
    r({ left:370, top:328, width:60, height:5, fill:accent }),
    t(400,356, 660, tg, 18, BF, bc),
    r({ left:200, top:462, width:400, height:1, fill:accent }),
    t(400,554, 660, det, 22, BF, tc),
    r({ left:200, top:860, width:400, height:1, fill:accent }),
    t(400,878, 660, rsvp, 16, BF, bc),
    r({ left:370, top:994, width:60, height:8, fill:border }),
  ]}
}

// Layout 3: Landscape Banner 1200×800
function lay3(p: Pal, cp: CP): Record<string, unknown> {
  const [bg, border, accent, tc, bc] = p
  const [hl, names, tg, det, rsvp] = cp
  return { version: '5.5.2', background: bg, objects: [
    r({ left:0, top:0, width:1200, height:800, fill:bg, stroke:border, strokeWidth:12 }),
    r({ left:28, top:28, width:1144, height:744, fill:'transparent', stroke:accent, strokeWidth:1 }),
    t(600,68, 1000, hl, 20, BF, bc, {italic:true}),
    t(600,118, 1000, names, 56, SF, tc, {bold:true}),
    l(200,265, 1000,265, accent, 2),
    t(600,284, 960, tg, 20, BF, bc),
    t(600,432, 960, det, 24, BF, tc),
    l(300,680, 900,680, accent),
    t(600,700, 900, rsvp, 19, BF, bc),
  ]}
}

// Layout 4: Square Festive 1000×1000 — triple border
function lay4(p: Pal, cp: CP): Record<string, unknown> {
  const [bg, border, accent, tc, bc] = p
  const [hl, names, tg, det, rsvp] = cp
  return { version: '5.5.2', background: bg, objects: [
    r({ left:0, top:0, width:1000, height:1000, fill:bg, stroke:border, strokeWidth:14 }),
    r({ left:26, top:26, width:948, height:948, fill:'transparent', stroke:accent, strokeWidth:2 }),
    r({ left:40, top:40, width:920, height:920, fill:'transparent', stroke:accent, strokeWidth:0.5 }),
    t(500,92, 880, hl, 21, BF, bc, {italic:true}),
    t(500,158, 880, names, 54, SF, tc, {bold:true}),
    l(160,315, 840,315, accent, 2),
    t(500,335, 860, tg, 19, BF, bc),
    l(160,438, 840,438, accent, 0.8),
    t(500,534, 860, det, 23, BF, tc),
    l(260,818, 740,818, accent, 1.5),
    t(500,838, 840, rsvp, 17, BF, bc),
    l(160,942, 840,942, accent, 2),
  ]}
}

const LAYOUTS = [lay0, lay1, lay2, lay3, lay4]
const ORIENTATIONS: Template['orientation'][] = ['portrait', 'portrait', 'portrait', 'landscape', 'square']

// ─── Occasion data ────────────────────────────────────────────────────────────

const SPECS: OccSpec[] = [
  // ──────── WEDDING ────────
  {
    slug: 'wedding',
    pals: [
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#BE185D'],
      ['#1C0010','#E11D48','#FB7185','#FECDD3','#FDA4AF'],
      ['#FFFBEB','#D97706','#FCD34D','#92400E','#B45309'],
      ['#1C1000','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#F5F3FF','#7C3AED','#C4B5FD','#4C1D95','#6D28D9'],
      ['#1E1B4B','#818CF8','#A5B4FC','#EDE9FE','#C7D2FE'],
      ['#ECFDF5','#059669','#6EE7B7','#064E3B','#047857'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#EFF6FF','#2563EB','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#0F172A','#6366F1','#A5B4FC','#E0E7FF','#C7D2FE'],
    ],
    titles: [
      ['Royal Garden Wedding',['floral','elegant','romantic']],
      ['Crimson Love Wedding',['bold','modern','romantic']],
      ['Golden Splendour Wedding',['luxe','traditional','gold']],
      ['Maharaja Wedding Night',['royal','opulent','grand']],
      ['Lavender Dream Wedding',['floral','pastel','soft']],
      ['Midnight Stars Wedding',['luxe','modern','celestial']],
      ['Sacred Garden Wedding',['botanical','serene','traditional']],
      ['Emerald Forest Wedding',['botanical','lush','elegant']],
      ['Ocean Blue Wedding',['coastal','minimal','fresh']],
      ['Midnight Indigo Wedding',['modern','bold','contemporary']],
    ],
    copies: [
      ['Wedding Invitation','Arjun & Priya','Together with their families, request the pleasure of your company at their wedding celebration','📅 Saturday, 15th February 2026\n⏰ 7:00 PM\n📍 The Grand Palace Banquet Hall\nMumbai, Maharashtra','RSVP by 10th February 2026 · +91 98765 43210'],
      ['Shadi Ka Nimantran','Rahul & Sneha','Two souls, one destiny. Please join us as we celebrate our sacred union','📅 Sunday, 22nd March 2026\n⏰ 6:30 PM\n📍 Taj Lake Palace\nUdaipur, Rajasthan','Kindly confirm by 15th March · +91 87654 32109'],
    ],
    prices: [49,99,29,149,0],
  },
  // ──────── BIRTHDAY KIDS ────────
  {
    slug: 'birthday-kids',
    pals: [
      ['#FFFBEB','#F59E0B','#FDE68A','#92400E','#B45309'],
      ['#92400E','#F59E0B','#FCD34D','#FFFBEB','#FEF3C7'],
      ['#FDF2F8','#EC4899','#F9A8D4','#9D174D','#BE185D'],
      ['#9D174D','#F472B6','#FBCFE8','#FFF0F6','#FCE7F3'],
      ['#F0F9FF','#0EA5E9','#BAE6FD','#075985','#0369A1'],
      ['#075985','#38BDF8','#7DD3FC','#E0F2FE','#BAE6FD'],
      ['#F0FDF4','#22C55E','#86EFAC','#14532D','#166534'],
      ['#14532D','#4ADE80','#86EFAC','#DCFCE7','#BBF7D0'],
      ['#FFF7ED','#F97316','#FDBA74','#7C2D12','#C2410C'],
      ['#EEF2FF','#6366F1','#A5B4FC','#312E81','#4338CA'],
    ],
    titles: [
      ['Rainbow Unicorn Birthday',['colorful','playful','whimsical']],
      ['Sunny Honeybee Party',['cute','bright','festive']],
      ['Princess Fairy Tale Party',['magical','pink','elegant']],
      ['Little Princess Birthday',['royal','cute','pink']],
      ['Under the Sea Birthday',['ocean','fun','colorful']],
      ['Space Explorer Birthday',['adventure','bold','cosmic']],
      ['Jungle Safari Party',['fun','wild','adventure']],
      ['Enchanted Forest Party',['magical','green','whimsical']],
      ['Little Chef Birthday',['cute','foodie','fun']],
      ['Superhero Birthday Bash',['bold','action','colorful']],
    ],
    copies: [
      ["It's a Party!","Aanya's 5th Birthday","Get ready for fun, games and cake! Join us for a magical celebration","📅 Sunday, 22nd March 2026\n⏰ 11:00 AM – 3:00 PM\n📍 Sunshine Kids Club, Bangalore","RSVP: Mummy — +91 98000 12345 · Dress: Bright & Colorful!"],
      ['You Are Invited!','Kabir Turns 7','Come join the fun — games, prizes and yummy cake for everyone!','📅 Saturday, 18th April 2026\n⏰ 3:00 PM – 7:00 PM\n📍 Fun World Party Hall\nPune, Maharashtra','RSVP: Papa — +91 95555 67890 · Wear your party best!'],
    ],
    prices: [0,29,0,29,49],
  },
  // ──────── BIRTHDAY ADULT ────────
  {
    slug: 'birthday-adult',
    pals: [
      ['#1E1B4B','#818CF8','#A5B4FC','#EDE9FE','#C7D2FE'],
      ['#EEF2FF','#4F46E5','#818CF8','#312E81','#4338CA'],
      ['#111827','#FCD34D','#F59E0B','#FEF9C3','#FDE68A'],
      ['#FFFBEB','#D97706','#FCD34D','#92400E','#B45309'],
      ['#0F172A','#EC4899','#F9A8D4','#FDF2F8','#FCE7F3'],
      ['#FDF2F8','#BE185D','#F9A8D4','#831843','#9D174D'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#F0FDF4','#059669','#34D399','#064E3B','#065F46'],
      ['#1C1917','#D4A017','#F59E0B','#FEF3C7','#FDE68A'],
      ['#F8FAFC','#334155','#64748B','#0F172A','#1E293B'],
    ],
    titles: [
      ['Midnight Blue Birthday Gala',['elegant','modern','bold']],
      ['Indigo Dreams Birthday',['modern','luxe','minimal']],
      ['Rooftop Gold Birthday',['bold','festive','glamorous']],
      ['Golden Hour Birthday',['warm','sophisticated','classic']],
      ['Midnight Rose Birthday',['romantic','dark','luxe']],
      ['Blush Birthday Soirée',['soft','elegant','feminine']],
      ['Emerald Garden Birthday',['botanical','fresh','elegant']],
      ['Garden Party Birthday',['outdoor','casual','elegant']],
      ['Bronze & Gold Birthday',['luxe','warm','celebratory']],
      ['Slate Modern Birthday',['minimal','contemporary','clean']],
    ],
    copies: [
      ['You Are Invited','Vikram Turns 30','Three decades of awesomeness — come celebrate in style!','📅 Saturday, 14th February 2026\n⏰ 8:00 PM – Midnight\n📍 Skyline Rooftop Lounge\nBandra, Mumbai','Cocktails · Music · Dancing · RSVP: +91 98765 43210'],
      ['Birthday Celebration','Ananya Turns 25!','A quarter century of brilliance! Join us for an evening to remember','📅 Saturday, 28th March 2026\n⏰ 7:00 PM\n📍 The Leela Palace\nNew Delhi','RSVP by 20th March · +91 97654 32109 · Dress: Formal'],
    ],
    prices: [29,49,0,99,29],
  },
  // ──────── BIRTHDAY MILESTONE ────────
  {
    slug: 'birthday-milestone',
    pals: [
      ['#1C1300','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#FFFBEB','#B45309','#FCD34D','#78350F','#92400E'],
      ['#1E1B4B','#A5B4FC','#C7D2FE','#EDE9FE','#DDD6FE'],
      ['#F5F3FF','#7C3AED','#A78BFA','#4C1D95','#5B21B6'],
      ['#0F172A','#6366F1','#818CF8','#E0E7FF','#C7D2FE'],
      ['#EEF2FF','#4338CA','#6366F1','#1E1B4B','#312E81'],
      ['#1C0010','#F43F5E','#FB7185','#FFF1F2','#FFE4E6'],
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#9F1239'],
      ['#111827','#10B981','#34D399','#ECFDF5','#D1FAE5'],
      ['#ECFDF5','#065F46','#059669','#064E3B','#047857'],
    ],
    titles: [
      ['Golden 50th Jubilee',['luxe','milestone','gold']],
      ['Sun-Kissed 50th Birthday',['warm','classic','elegant']],
      ['Stellar 30th Celebration',['modern','luxe','bold']],
      ['Purple Reign 40th',['royal','sophisticated','bold']],
      ['Midnight 60th Gala',['elegant','grand','milestone']],
      ['Sapphire 65th Birthday',['classic','regal','formal']],
      ['Ruby 25th Milestone',['romantic','bold','luxe']],
      ['Rose Gold 18th Birthday',['youthful','elegant','festive']],
      ['Emerald 70th Celebration',['grand','milestone','green']],
      ['Pearl 80th Anniversary',['serene','elegant','timeless']],
    ],
    copies: [
      ['Half a Century of Joy','Sunita Turns 50!','Five fabulous decades — join us in celebrating a golden life lived fully','📅 Sunday, 1st March 2026\n⏰ 6:00 PM\n📍 Radisson Blu\nAmritsar, Punjab','Dinner · Dance · Memories · RSVP: +91 98551 23457'],
      ['Celebrating a Milestone','Rajan Turns 60','Six magnificent decades — please grace us with your presence and blessings','📅 Saturday, 15th November 2026\n⏰ 7:00 PM\n📍 ITC Grand Bharat\nGurgaon, Haryana','Formal Attire · RSVP by 5th November · +91 99887 56781'],
    ],
    prices: [49,99,29,149,49],
  },
  // ──────── ENGAGEMENT ────────
  {
    slug: 'engagement',
    pals: [
      ['#FDF2F8','#BE185D','#F9A8D4','#831843','#9D174D'],
      ['#831843','#F472B6','#FBCFE8','#FFF0F6','#FCE7F3'],
      ['#FFFBEB','#D97706','#FDE68A','#92400E','#B45309'],
      ['#1C1000','#F59E0B','#FCD34D','#FEF9C3','#FEF3C7'],
      ['#F0F9FF','#0EA5E9','#7DD3FC','#0C4A6E','#075985'],
      ['#0C4A6E','#38BDF8','#7DD3FC','#E0F2FE','#BAE6FD'],
      ['#F5F3FF','#8B5CF6','#DDD6FE','#4C1D95','#5B21B6'],
      ['#2E1065','#A78BFA','#C4B5FD','#EDE9FE','#DDD6FE'],
      ['#FFF1F2','#E11D48','#FECDD3','#881337','#9F1239'],
      ['#ECFDF5','#059669','#A7F3D0','#064E3B','#065F46'],
    ],
    titles: [
      ['Pink Blossom Engagement',['floral','romantic','soft']],
      ['Ruby Heart Engagement',['bold','romantic','luxe']],
      ['Golden Ring Ceremony',['luxe','classic','warm']],
      ['Champagne Toast Engagement',['elegant','festive','gold']],
      ['Blue Lagoon Engagement',['fresh','modern','coastal']],
      ['Aqua Dream Engagement',['soft','modern','minimal']],
      ['Lilac Promise Ceremony',['floral','pastel','romantic']],
      ['Starlit Engagement Night',['celestial','dark','luxe']],
      ['Crimson Rose Engagement',['bold','romantic','classic']],
      ['Garden Emerald Engagement',['botanical','fresh','elegant']],
    ],
    copies: [
      ['We Said Yes!','Rahul & Sneha are Engaged!','With joy in our hearts, we invite you to celebrate our engagement ring ceremony','📅 Sunday, 8th March 2026\n⏰ 5:00 PM\n📍 Taj Hotel Banquet\nPune, Maharashtra','Join us for the ring ceremony & celebration · RSVP: +91 97654 32109'],
      ['Ring Ceremony Invitation','Karan & Divya','Two hearts have found each other — please join us as we celebrate our promise','📅 Saturday, 25th April 2026\n⏰ 6:00 PM\n📍 The Oberoi Grand\nNew Delhi','RSVP by 18th April · +91 96543 21098 · Dress: Formal'],
    ],
    prices: [49,29,0,99,29],
  },
  // ──────── MEHENDI ────────
  {
    slug: 'mehendi',
    pals: [
      ['#F0FDF4','#059669','#6EE7B7','#064E3B','#047857'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#FEFCE8','#CA8A04','#FDE047','#713F12','#92400E'],
      ['#713F12','#EAB308','#FDE047','#FEFCE8','#FEF9C3'],
      ['#FFF7ED','#EA580C','#FDBA74','#7C2D12','#9A3412'],
      ['#7C2D12','#FB923C','#FDBA74','#FFF7ED','#FED7AA'],
      ['#FDF4FF','#C026D3','#E879F9','#701A75','#86198F'],
      ['#701A75','#E879F9','#F0ABFC','#FDF4FF','#FAE8FF'],
      ['#ECFDF5','#10B981','#6EE7B7','#065F46','#047857'],
      ['#1C1000','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
    ],
    titles: [
      ['Verdant Mehendi Night',['traditional','floral','festive']],
      ['Emerald Mehendi Ceremony',['bold','traditional','rich']],
      ['Golden Henna Evening',['classic','warm','festive']],
      ['Amber Mehendi Celebration',['warm','traditional','vibrant']],
      ['Saffron Mehendi Night',['festive','traditional','bold']],
      ['Copper Henna Ceremony',['earthy','traditional','warm']],
      ['Violet Mehendi Evening',['elegant','festive','vibrant']],
      ['Orchid Mehendi Night',['floral','exotic','rich']],
      ['Garden Mehendi Party',['fresh','botanical','festive']],
      ['Royal Mehendi Ceremony',['grand','luxe','traditional']],
    ],
    copies: [
      ['Mehendi Ceremony','Join us for Anjali\'s Mehendi','An evening of henna, music, dance and sweet treats on the eve of the wedding','📅 Thursday, 12th February 2026\n⏰ 4:00 PM onwards\n📍 Verma Residence\nJaipur, Rajasthan','Ladies Only Event · Mehndi & Music · RSVP: +91 98100 23456'],
      ['Henna Night Invitation','Priya\'s Mehendi Evening','Come drenched in color — join us for an evening of art, dance and festivity','📅 Friday, 20th March 2026\n⏰ 5:00 PM onwards\n📍 Sharma Farmhouse\nLudhiana, Punjab','Dress: Ethnic · Mehendi Artists · RSVP: +91 95432 67890'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── SANGEET ────────
  {
    slug: 'sangeet',
    pals: [
      ['#2E1065','#A78BFA','#C4B5FD','#EDE9FE','#DDD6FE'],
      ['#F5F3FF','#7C3AED','#A78BFA','#4C1D95','#5B21B6'],
      ['#1C1000','#F59E0B','#FCD34D','#FEF3C7','#FDE68A'],
      ['#FFFBEB','#D97706','#FCD34D','#92400E','#B45309'],
      ['#1C0010','#EC4899','#F9A8D4','#FDF2F8','#FCE7F3'],
      ['#FDF2F8','#BE185D','#F9A8D4','#831843','#9D174D'],
      ['#0F172A','#6366F1','#818CF8','#E0E7FF','#C7D2FE'],
      ['#EEF2FF','#4F46E5','#818CF8','#312E81','#4338CA'],
      ['#111827','#10B981','#34D399','#D1FAE5','#A7F3D0'],
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#BE185D'],
    ],
    titles: [
      ['Bollywood Sangeet Night',['vibrant','festive','bold']],
      ['Sangeet Celebration',['traditional','festive','musical']],
      ['Golden Sangeet Evening',['luxe','festive','classic']],
      ['Amber Dance Night',['warm','festive','energetic']],
      ['Fuchsia Sangeet Party',['bold','vibrant','festive']],
      ['Rose Sangeet Soirée',['romantic','festive','elegant']],
      ['Electric Sangeet Night',['modern','vibrant','bold']],
      ['Indigo Sangeet Gala',['sophisticated','festive','luxe']],
      ['Emerald Sangeet Evening',['fresh','festive','vibrant']],
      ['Crimson Dance Night',['bold','festive','passionate']],
    ],
    copies: [
      ['Sangeet Night','Dance & Celebrate with Us!','An evening of Bollywood beats, family performances and non-stop celebration','📅 Friday, 13th February 2026\n⏰ 7:00 PM – 11:00 PM\n📍 Crystal Palace Banquets\nLudhiana, Punjab','Live Music · Group Dance · Dinner · RSVP: +91 97700 88899'],
      ['Sangeet Invitation','The Night Before the Wedding','Join us for an unforgettable evening of music, dance and pure joy','📅 Thursday, 19th March 2026\n⏰ 6:30 PM onwards\n📍 Leela Ambience\nGurgaon, Haryana','Dress: Ethnic Chic · RSVP: +91 99001 77665'],
    ],
    prices: [29,49,0,29,99],
  },
  // ──────── BABY SHOWER ────────
  {
    slug: 'baby-shower',
    pals: [
      ['#ECFEFF','#0891B2','#67E8F9','#164E63','#0E7490'],
      ['#164E63','#22D3EE','#67E8F9','#ECFEFF','#CFFAFE'],
      ['#FFF0F6','#EC4899','#F9A8D4','#831843','#9D174D'],
      ['#831843','#F472B6','#FBCFE8','#FFF0F6','#FCE7F3'],
      ['#F0FDF4','#22C55E','#86EFAC','#14532D','#166534'],
      ['#FFFBEB','#F59E0B','#FDE68A','#92400E','#B45309'],
      ['#F5F3FF','#8B5CF6','#C4B5FD','#4C1D95','#5B21B6'],
      ['#FAFAFA','#6B7280','#9CA3AF','#111827','#1F2937'],
      ['#FFF1F2','#F43F5E','#FDA4AF','#881337','#9F1239'],
      ['#EFF6FF','#3B82F6','#93C5FD','#1E3A8A','#1D4ED8'],
    ],
    titles: [
      ['Sweet Baby Blue Shower',['pastel','cute','minimal']],
      ['Ocean Breeze Baby Shower',['coastal','fresh','serene']],
      ['Pink Petal Baby Shower',['floral','soft','feminine']],
      ['Cherry Blossom Shower',['floral','romantic','pastel']],
      ['Garden Baby Shower',['botanical','fresh','elegant']],
      ['Sunny Day Baby Shower',['bright','cheerful','warm']],
      ['Lavender Dreams Shower',['soft','dreamy','pastel']],
      ['Silver Cloud Shower',['minimal','modern','serene']],
      ['Rose Petal Baby Shower',['floral','elegant','soft']],
      ['Sky Blue Baby Shower',['fresh','airy','minimal']],
    ],
    copies: [
      ['Baby Shower Invitation','Divya & Kiran are expecting!','Celebrate the upcoming arrival of their little bundle of joy with us','📅 Sunday, 5th April 2026\n⏰ 3:00 PM – 7:00 PM\n📍 Bliss Banquet Hall\nHyderabad, Telangana','Games · Gifts · Celebration · RSVP: +91 95555 44433'],
      ['Baby Shower Party','Join us to welcome Baby Kapoor!','A sweet gathering to shower love on the parents-to-be before the big arrival','📅 Saturday, 18th April 2026\n⏰ 2:00 PM – 6:00 PM\n📍 The Kapoor Residence\nPune, Maharashtra','Dress: Pastels · RSVP: Priya — +91 96000 32198'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── NAMING CEREMONY ────────
  {
    slug: 'naming-ceremony',
    pals: [
      ['#FFF0F6','#EC4899','#F9A8D4','#831843','#9D174D'],
      ['#831843','#F472B6','#FBCFE8','#FFF0F6','#FCE7F3'],
      ['#F0FDF4','#22C55E','#86EFAC','#14532D','#166534'],
      ['#ECFDF5','#059669','#6EE7B7','#064E3B','#047857'],
      ['#FEFCE8','#CA8A04','#FDE047','#713F12','#92400E'],
      ['#FFF7ED','#EA580C','#FDBA74','#7C2D12','#9A3412'],
      ['#EFF6FF','#3B82F6','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#FFFBEB','#D97706','#FDE68A','#92400E','#B45309'],
      ['#F5F3FF','#8B5CF6','#C4B5FD','#4C1D95','#5B21B6'],
      ['#ECFEFF','#0891B2','#67E8F9','#164E63','#0E7490'],
    ],
    titles: [
      ['Sacred Naamkaran Ceremony',['traditional','devotional','elegant']],
      ['Blossom Naming Ceremony',['floral','soft','traditional']],
      ['Garden Naamkaran',['botanical','serene','traditional']],
      ['Sacred Naming Ceremony',['traditional','devotional','warm']],
      ['Golden Naamkaran',['classic','traditional','festive']],
      ['Saffron Blessing Ceremony',['traditional','warm','sacred']],
      ['Sky Blessing Ceremony',['serene','spiritual','soft']],
      ['Amber Naming Day',['warm','traditional','elegant']],
      ['Violet Blessing Ceremony',['elegant','sacred','soft']],
      ['Ocean Naming Ceremony',['serene','soft','traditional']],
    ],
    copies: [
      ['Naamkaran Ceremony','Blessing of Baby Aanya','With grateful hearts, we invite you to witness the sacred naming of our daughter','📅 Sunday, 10th May 2026\n⏰ 10:00 AM\n📍 Sri Laxmi Temple Hall\nBangalore, Karnataka','Puja & Prasad · Lunch · RSVP: +91 98765 11223'],
      ['Naming Ceremony','Baby Vihaan Receives His Name','Join us for this auspicious ceremony as our son receives his name and blessings','📅 Saturday, 27th June 2026\n⏰ 9:00 AM\n📍 Gupta Residence\nLucknow, Uttar Pradesh','Pooja · Breakfast · RSVP: +91 97654 98765'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── DIWALI ────────
  {
    slug: 'diwali',
    pals: [
      ['#1C0A00','#F59E0B','#FCD34D','#FEF3C7','#FDE68A'],
      ['#FFFBEB','#D97706','#F59E0B','#92400E','#B45309'],
      ['#12100A','#DC2626','#F87171','#FEE2E2','#FECACA'],
      ['#FFF7ED','#EA580C','#FB923C','#7C2D12','#9A3412'],
      ['#1A0A2E','#A855F7','#C084FC','#F3E8FF','#E9D5FF'],
      ['#F5F3FF','#7C3AED','#A78BFA','#4C1D95','#5B21B6'],
      ['#0F172A','#EAB308','#FDE047','#FEFCE8','#FEF9C3'],
      ['#713F12','#FCD34D','#FDE68A','#FFFBEB','#FEF3C7'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#1C0010','#F43F5E','#FB7185','#FFF1F2','#FFE4E6'],
    ],
    titles: [
      ['Golden Diwali Celebration',['festive','traditional','gold']],
      ['Shubh Deepavali',['traditional','festive','warm']],
      ['Diwali Pooja & Party',['festive','devotional','vibrant']],
      ['Saffron Diwali Night',['traditional','warm','festive']],
      ['Violet Festival of Lights',['modern','festive','elegant']],
      ['Purple Diwali Soirée',['elegant','modern','festive']],
      ['Midnight Diwali Gala',['luxe','festive','bold']],
      ['Amber Diwali Evening',['warm','traditional','classic']],
      ['Emerald Diwali Gathering',['festive','elegant','fresh']],
      ['Crimson Diwali Fiesta',['bold','festive','vibrant']],
    ],
    copies: [
      ['Shubh Deepavali!','The Sharma Family','With warmth and festivity, we invite you to join us for Diwali celebrations','📅 Friday, 20th October 2026\n⏰ 6:00 PM onwards\n📍 Sharma Residence\nNew Delhi','Sweets · Crackers · Puja · Dinner · RSVP: +91 99887 76655'],
      ['Diwali Invitation','The Gupta Family','Light up your evening with us as we celebrate the festival of lights and new beginnings','📅 Thursday, 19th October 2026\n⏰ 6:30 PM\n📍 12, Laxmi Nagar\nNew Delhi','Rangoli · Puja · Fireworks · RSVP: +91 98765 43210'],
    ],
    prices: [29,0,49,29,0],
  },
  // ──────── GANESH CHATURTHI ────────
  {
    slug: 'ganesh-chaturthi',
    pals: [
      ['#431407','#FB923C','#FDBA74','#FFF7ED','#FED7AA'],
      ['#FFF7ED','#EA580C','#FDBA74','#7C2D12','#9A3412'],
      ['#1C0A00','#F59E0B','#FCD34D','#FEF3C7','#FDE68A'],
      ['#FFFBEB','#CA8A04','#FDE047','#713F12','#92400E'],
      ['#3B0764','#C026D3','#E879F9','#FDF4FF','#FAE8FF'],
      ['#FDF4FF','#A21CAF','#E879F9','#701A75','#86198F'],
      ['#0F172A','#FB923C','#FDBA74','#FFF7ED','#FED7AA'],
      ['#7C2D12','#FCD34D','#FDE68A','#FFFBEB','#FEF3C7'],
      ['#064E3B','#10B981','#34D399','#D1FAE5','#A7F3D0'],
      ['#1E1B4B','#818CF8','#A5B4FC','#EDE9FE','#C7D2FE'],
    ],
    titles: [
      ['Ganesh Utsav Invitation',['devotional','festive','traditional']],
      ['Ganpati Celebration',['traditional','vibrant','sacred']],
      ['Bappa\'s Arrival Puja',['devotional','festive','warm']],
      ['Golden Ganesh Puja',['traditional','luxe','devotional']],
      ['Ganesh Chaturthi Pooja',['sacred','traditional','festive']],
      ['Morya Festival Gathering',['vibrant','devotional','festive']],
      ['Midnight Ganesh Utsav',['bold','festive','devotional']],
      ['Amber Ganpati Night',['warm','traditional','festive']],
      ['Sacred Ganesh Pooja',['devotional','serene','traditional']],
      ['Indigo Ganesh Festival',['modern','festive','elegant']],
    ],
    copies: [
      ['Ganpati Utsav','The Joshi Family Invites You','Bappa is arriving! Join us for pooja, prasad and festive celebrations','📅 Tuesday, 25th August 2026\n⏰ 10:00 AM\n📍 Joshi Residence, Dadar\nMumbai, Maharashtra','Modak & Prasad · RSVP: +91 98765 11223'],
      ['Ganesh Chaturthi Pooja','The Patil Family','With devotion and joy, we invite you to celebrate Ganapati Bappa with us','📅 Tuesday, 25th August 2026\n⏰ 11:00 AM onwards\n📍 Patil Wada, Pune\nMaharashtra','Aarti · Prasad · Dinner · RSVP: +91 97700 55432'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── HOLI ────────
  {
    slug: 'holi',
    pals: [
      ['#FFF0F6','#EC4899','#F9A8D4','#831843','#9D174D'],
      ['#F0FDF4','#16A34A','#86EFAC','#14532D','#166534'],
      ['#EFF6FF','#3B82F6','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#FEFCE8','#CA8A04','#FDE047','#713F12','#92400E'],
      ['#FFF7ED','#EA580C','#FDBA74','#7C2D12','#9A3412'],
      ['#1C0A00','#EC4899','#F9A8D4','#FFF0F6','#FCE7F3'],
      ['#0C4A6E','#38BDF8','#7DD3FC','#E0F2FE','#BAE6FD'],
      ['#1A0A2E','#A855F7','#C084FC','#F3E8FF','#E9D5FF'],
      ['#FFFBEB','#D97706','#FDE068','#92400E','#B45309'],
      ['#0F172A','#10B981','#34D399','#D1FAE5','#A7F3D0'],
    ],
    titles: [
      ['Holi Hai! Color Festival',['vibrant','festive','fun']],
      ['Spring Holi Party',['colorful','joyful','festive']],
      ['Rainbow Holi Celebration',['colorful','festive','bold']],
      ['Holi Color Fiesta',['vibrant','festive','energetic']],
      ['Saffron Holi Party',['warm','festive','traditional']],
      ['Fuchsia Holi Night',['bold','festive','vibrant']],
      ['Ocean Holi Splash',['fresh','festive','fun']],
      ['Purple Holi Bash',['modern','festive','vibrant']],
      ['Golden Holi Morning',['warm','traditional','festive']],
      ['Emerald Holi Party',['fresh','festive','modern']],
    ],
    copies: [
      ['Holi Celebration!','The Agarwal Family','Get ready to get colourful — join us for Holi with music, colours and fun!','📅 Sunday, 8th March 2026\n⏰ 10:00 AM – 4:00 PM\n📍 Agarwal Farmhouse\nNoida, Uttar Pradesh','Colors & Bhang Thandai · Lunch · RSVP: +91 98100 44556'],
      ['Happy Holi!','The Mehta Family Invites You','Celebrate the festival of spring and colors with food, music and joy','📅 Saturday, 7th March 2026\n⏰ 11:00 AM – 3:00 PM\n📍 Mehta Bungalow\nAhmedabad, Gujarat','Thandai · Gujiya · DJ · RSVP: +91 96543 77889'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── EID ────────
  {
    slug: 'eid',
    pals: [
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#F0FDF4','#059669','#34D399','#064E3B','#065F46'],
      ['#1C1300','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#FFFBEB','#CA8A04','#FDE047','#713F12','#92400E'],
      ['#1E1B4B','#818CF8','#A5B4FC','#EDE9FE','#C7D2FE'],
      ['#EEF2FF','#4F46E5','#818CF8','#312E81','#4338CA'],
      ['#0C4A6E','#38BDF8','#7DD3FC','#E0F2FE','#BAE6FD'],
      ['#1C0010','#F43F5E','#FB7185','#FFF1F2','#FFE4E6'],
      ['#111827','#10B981','#34D399','#D1FAE5','#A7F3D0'],
      ['#FFF7ED','#C2410C','#FDBA74','#7C2D12','#9A3412'],
    ],
    titles: [
      ['Eid Mubarak Celebration',['traditional','festive','elegant']],
      ['Eid al-Fitr Gathering',['traditional','joyful','warm']],
      ['Golden Eid Celebration',['luxe','festive','classic']],
      ['Eid Feast & Festivities',['traditional','festive','warm']],
      ['Starlit Eid Evening',['elegant','festive','modern']],
      ['Sapphire Eid Night',['modern','elegant','festive']],
      ['Ocean Eid Celebration',['fresh','festive','modern']],
      ['Crimson Eid Gathering',['bold','festive','vibrant']],
      ['Emerald Crescent Night',['traditional','festive','rich']],
      ['Amber Eid Dinner',['warm','festive','traditional']],
    ],
    copies: [
      ['Eid Mubarak!','The Khan Family','With the blessings of Allah, we invite you to our Eid celebration and feast','📅 Sunday, 31st March 2026\n⏰ After Eid prayers, 11:00 AM\n📍 Khan Residence\nLucknow, Uttar Pradesh','Biryani · Seviyan · Sheer Khurma · RSVP: +91 98720 34567'],
      ['Eid Celebration','The Ansari Family','May this Eid bring joy and togetherness — join us for our festive gathering','📅 Monday, 1st April 2026\n⏰ 12:00 PM onwards\n📍 Ansari Villa\nHyderabad, Telangana','Eid Lunch · Sweets · RSVP: +91 97654 23456'],
    ],
    prices: [0,29,49,29,0],
  },
  // ──────── CHRISTMAS ────────
  {
    slug: 'christmas',
    pals: [
      ['#FFFBEB','#DC2626','#FCA5A5','#991B1B','#7F1D1D'],
      ['#7F1D1D','#FCA5A5','#FECACA','#FEF2F2','#FFE4E6'],
      ['#F0FDF4','#16A34A','#86EFAC','#14532D','#166534'],
      ['#14532D','#4ADE80','#86EFAC','#DCFCE7','#BBF7D0'],
      ['#111827','#FCD34D','#F59E0B','#FEF9C3','#FDE68A'],
      ['#FFFBEB','#CA8A04','#FDE047','#713F12','#78350F'],
      ['#1E1B4B','#818CF8','#A5B4FC','#EDE9FE','#C7D2FE'],
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#9F1239'],
      ['#0F172A','#10B981','#34D399','#D1FAE5','#A7F3D0'],
      ['#FAFAFA','#DC2626','#FCA5A5','#7F1D1D','#991B1B'],
    ],
    titles: [
      ['Festive Christmas Party',['festive','colorful','bold']],
      ['Merry Christmas Gathering',['warm','festive','traditional']],
      ['Christmas Green Celebration',['festive','natural','classic']],
      ['Emerald Christmas Night',['elegant','festive','botanical']],
      ['Midnight Christmas Gala',['luxe','festive','bold']],
      ['Golden Christmas Evening',['warm','classic','festive']],
      ['Starlit Christmas Soirée',['elegant','festive','modern']],
      ['Crimson Christmas Party',['bold','festive','vibrant']],
      ['Forest Christmas Night',['botanical','elegant','festive']],
      ['Ivory Christmas Dinner',['classic','minimal','elegant']],
    ],
    copies: [
      ['Christmas Party 2026','The D\'Souza Family','Wishing you joy and cheer — join us for Christmas celebrations and dinner','📅 Thursday, 25th December 2026\n⏰ 6:00 PM\n📍 D\'Souza Residence\nBandra West, Mumbai','Carols · Gifts · Christmas Dinner · RSVP: +91 91234 56789'],
      ['Merry Christmas!','The Fernando Family Invites You','Peace, joy and laughter — celebrate the season of giving with us','📅 Wednesday, 24th December 2026\n⏰ 7:00 PM\n📍 Fernando Villa\nGoa','Christmas Eve Dinner · RSVP: +91 98765 12345'],
    ],
    prices: [29,0,49,29,0],
  },
  // ──────── OFFICE PARTY ────────
  {
    slug: 'office-party',
    pals: [
      ['#EFF6FF','#1D4ED8','#93C5FD','#1E3A8A','#2563EB'],
      ['#0F172A','#6366F1','#818CF8','#E0E7FF','#C7D2FE'],
      ['#F8FAFC','#334155','#94A3B8','#0F172A','#1E293B'],
      ['#0F172A','#94A3B8','#CBD5E1','#F1F5F9','#E2E8F0'],
      ['#111827','#FCD34D','#F59E0B','#FEF9C3','#FDE68A'],
      ['#FFFBEB','#D97706','#FDE68A','#92400E','#B45309'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#F0FDF4','#059669','#34D399','#064E3B','#065F46'],
      ['#1C0010','#E11D48','#FB7185','#FFF1F2','#FFE4E6'],
      ['#FAFAFA','#1D4ED8','#93C5FD','#1E3A8A','#2563EB'],
    ],
    titles: [
      ['Annual Corporate Gala',['professional','modern','minimal']],
      ['Team Year-End Party',['corporate','festive','modern']],
      ['Corporate Awards Night',['professional','grand','elegant']],
      ['Office Celebration 2026',['corporate','modern','festive']],
      ['Year-End Gala Night',['luxe','corporate','bold']],
      ['Golden Awards Ceremony',['luxe','professional','warm']],
      ['Office Summer Party',['casual','festive','team']],
      ['Team Appreciation Night',['corporate','warm','elegant']],
      ['Quarterly Celebration',['professional','festive','team']],
      ['Annual Kick-Off Party',['corporate','energetic','modern']],
    ],
    copies: [
      ['Annual Office Party 2026','TechCorp India Pvt. Ltd.','Celebrating a year of achievements — join all team members and families for an evening of recognition and fun','📅 Friday, 19th December 2026\n⏰ 6:30 PM\n📍 Leela Hotel Grand Ballroom\nBengaluru, Karnataka','Awards · Dinner · Entertainment · RSVP: hr@techcorp.in by Dec 15'],
      ['Year-End Celebration','InnovateCo Team','Thank you for an incredible year — join us for our annual celebration and awards night','📅 Saturday, 20th December 2026\n⏰ 7:00 PM\n📍 Hyatt Regency Grand Ballroom\nMumbai, Maharashtra','Dinner · DJ · Awards · RSVP: +91 22 6789 0123'],
    ],
    prices: [49,99,29,0,149],
  },
  // ──────── FAREWELL ────────
  {
    slug: 'farewell',
    pals: [
      ['#F5F3FF','#7C3AED','#C4B5FD','#4C1D95','#5B21B6'],
      ['#2E1065','#A78BFA','#C4B5FD','#EDE9FE','#DDD6FE'],
      ['#FFF7ED','#D97706','#FDBA74','#7C2D12','#92400E'],
      ['#1C1000','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#EFF6FF','#2563EB','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#0F172A','#6366F1','#818CF8','#E0E7FF','#C7D2FE'],
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#BE185D'],
      ['#1C0010','#EC4899','#F9A8D4','#FFF0F6','#FCE7F3'],
      ['#F0FDF4','#059669','#6EE7B7','#064E3B','#047857'],
      ['#FAFAFA','#6B7280','#9CA3AF','#111827','#374151'],
    ],
    titles: [
      ['Heartfelt Farewell Gathering',['warm','emotional','elegant']],
      ['Until We Meet Again',['sentimental','warm','elegant']],
      ['Golden Goodbye Party',['warm','festive','classic']],
      ['Cheers to New Beginnings',['celebratory','warm','festive']],
      ['Bon Voyage Party',['festive','travel','warm']],
      ['Journey Ahead Farewell',['inspirational','warm','festive']],
      ['Farewell & Thank You',['grateful','warm','elegant']],
      ['Sweet Farewell Evening',['soft','emotional','elegant']],
      ['Garden Farewell Party',['botanical','warm','casual']],
      ['Farewell Dinner',['elegant','warm','sophisticated']],
    ],
    copies: [
      ['Farewell Party','Bidding Goodbye to Deepak Joshi','As our beloved colleague embarks on an exciting new journey, let us send him off in style','📅 Friday, 28th March 2026\n⏰ 7:00 PM\n📍 Office Terrace\nPrestige Tech Park, Bengaluru','Dinner · Memories · Gifts · RSVP: Priya HR — +91 96000 77788'],
      ['Farewell Gathering','Celebrating Priya\'s Next Chapter','Join us to bid a fond farewell and wish Priya all the best in her new adventure','📅 Friday, 15th May 2026\n⏰ 6:30 PM\n📍 The Ritz Carlton\nPune, Maharashtra','Dinner · Speeches · Memories · RSVP: +91 98765 44556'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── PROMOTION ────────
  {
    slug: 'promotion',
    pals: [
      ['#1C1300','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#FFFBEB','#B45309','#FCD34D','#78350F','#92400E'],
      ['#1E1B4B','#818CF8','#A5B4FC','#EDE9FE','#C7D2FE'],
      ['#EEF2FF','#4F46E5','#818CF8','#312E81','#4338CA'],
      ['#0F172A','#10B981','#34D399','#D1FAE5','#A7F3D0'],
      ['#F0FDF4','#059669','#34D399','#064E3B','#065F46'],
      ['#1C0010','#E11D48','#FB7185','#FFF1F2','#FFE4E6'],
      ['#FFF1F2','#BE185D','#F9A8D4','#831843','#9D174D'],
      ['#111827','#EAB308','#FDE047','#FEFCE8','#FEF9C3'],
      ['#FAFAFA','#334155','#64748B','#0F172A','#1E293B'],
    ],
    titles: [
      ['Promotion Celebration Party',['achievement','festive','modern']],
      ['Cheers to the New Role!',['celebratory','warm','festive']],
      ['Rise & Celebrate!',['bold','achievement','festive']],
      ['Climbing the Ladder',['modern','professional','festive']],
      ['New Chapter Celebration',['inspirational','festive','warm']],
      ['Success Party',['achievement','elegant','festive']],
      ['Career Milestone Party',['professional','festive','bold']],
      ['Promotion Dinner',['elegant','professional','festive']],
      ['Golden Achievement Night',['luxe','achievement','warm']],
      ['Corporate Milestone Party',['professional','festive','minimal']],
    ],
    copies: [
      ['Promotion Celebration!','Join us to celebrate Rohan\'s Promotion!','From team member to team leader — celebrate this incredible milestone with us','📅 Saturday, 18th April 2026\n⏰ 7:00 PM\n📍 The Taj Mahal Hotel\nMumbai, Maharashtra','Cocktails · Dinner · Speeches · RSVP: +91 98765 44321'],
      ['Achievement Celebration','Neha Got Promoted!','Six years of hard work, dedication and brilliance — let us celebrate together!','📅 Friday, 24th April 2026\n⏰ 6:30 PM\n📍 Skyline Terrace Bar\nGurgaon, Haryana','Drinks · Dinner · RSVP: +91 97654 11223'],
    ],
    prices: [29,49,0,29,99],
  },
  // ──────── DINNER PARTY ────────
  {
    slug: 'dinner-party',
    pals: [
      ['#0F172A','#D4A017','#F59E0B','#FEF3C7','#FDE68A'],
      ['#1C1300','#D97706','#FCD34D','#FEF9C3','#FDE68A'],
      ['#1E1B4B','#818CF8','#A5B4FC','#EDE9FE','#C7D2FE'],
      ['#EEF2FF','#4F46E5','#818CF8','#312E81','#4338CA'],
      ['#1C0010','#E11D48','#FB7185','#FFF1F2','#FFE4E6'],
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#9F1239'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#ECFDF5','#059669','#6EE7B7','#064E3B','#047857'],
      ['#111827','#94A3B8','#CBD5E1','#F8FAFC','#F1F5F9'],
      ['#1C1300','#CA8A04','#FDE047','#FEF9C3','#FEFCE8'],
    ],
    titles: [
      ['Candlelit Dinner Evening',['elegant','intimate','sophisticated']],
      ['Gold & Ivory Dinner',['luxe','classic','elegant']],
      ['Midnight Dinner Soirée',['sophisticated','dark','luxe']],
      ['Indigo Dinner Evening',['modern','elegant','minimal']],
      ['Crimson Dinner Party',['bold','elegant','festive']],
      ['Rose Dinner Evening',['romantic','elegant','soft']],
      ['Garden Dinner Party',['botanical','fresh','elegant']],
      ['Emerald Dinner Gathering',['sophisticated','green','elegant']],
      ['Slate Dinner Evening',['minimal','modern','sophisticated']],
      ['Amber Dinner Night',['warm','elegant','classic']],
    ],
    copies: [
      ['Dinner Party Invitation','You are cordially invited','Please join us for an intimate evening of fine dining and wonderful company','📅 Saturday, 7th March 2026\n⏰ 7:30 PM\n📍 Kapoor Residence, Golf Links\nNew Delhi','Cocktails at 7 PM · 4-Course Dinner · RSVP: +91 99001 55667'],
      ['Dinner Evening','An Evening to Remember','We request the pleasure of your company for dinner and delightful conversation','📅 Friday, 20th February 2026\n⏰ 8:00 PM\n📍 The Mehta Estate\nBengaluru, Karnataka','Fine Dining · RSVP by 15th February · +91 98765 22334'],
    ],
    prices: [49,99,29,0,149],
  },
  // ──────── LUNCH PARTY ────────
  {
    slug: 'lunch-party',
    pals: [
      ['#F0FDF4','#16A34A','#86EFAC','#14532D','#166534'],
      ['#14532D','#4ADE80','#86EFAC','#DCFCE7','#BBF7D0'],
      ['#FFFBEB','#D97706','#FDE68A','#92400E','#B45309'],
      ['#92400E','#FCD34D','#FDE68A','#FFFBEB','#FEF9C3'],
      ['#EFF6FF','#3B82F6','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#F5F3FF','#8B5CF6','#C4B5FD','#4C1D95','#5B21B6'],
      ['#FFF0F6','#EC4899','#F9A8D4','#831843','#9D174D'],
      ['#FFF7ED','#EA580C','#FDBA74','#7C2D12','#9A3412'],
      ['#ECFEFF','#0891B2','#67E8F9','#164E63','#0E7490'],
      ['#FAFAFA','#475569','#94A3B8','#0F172A','#1E293B'],
    ],
    titles: [
      ['Sunday Lunch Gathering',['casual','warm','fresh']],
      ['Garden Lunch Party',['botanical','fresh','casual']],
      ['Sunny Afternoon Lunch',['warm','casual','bright']],
      ['Golden Lunch Celebration',['festive','warm','casual']],
      ['Blue Luncheon',['elegant','fresh','minimal']],
      ['Lavender Luncheon',['soft','elegant','floral']],
      ['Pink Lunch Party',['festive','fun','casual']],
      ['Saffron Afternoon Lunch',['warm','traditional','casual']],
      ['Teal Garden Luncheon',['fresh','elegant','botanical']],
      ['Ivory Luncheon',['minimal','classic','elegant']],
    ],
    copies: [
      ['Lunch Party Invitation','The Singhania Family Invites You','Come enjoy good food, great company and sunshine at our Sunday lunch gathering','📅 Sunday, 15th March 2026\n⏰ 12:30 PM\n📍 Singhania Garden House\nJaipur, Rajasthan','3-Course Lunch · RSVP: +91 98100 44567'],
      ['Luncheon Invitation','You Are Invited!','Join us for a delightful afternoon of food, laughter and wonderful company','📅 Saturday, 21st March 2026\n⏰ 1:00 PM\n📍 The Oberoi Garden Restaurant\nNew Delhi','Set Lunch · RSVP by 15th March · +91 97654 33221'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── BRUNCH ────────
  {
    slug: 'brunch',
    pals: [
      ['#FFF7ED','#D97706','#FDBA74','#7C2D12','#92400E'],
      ['#7C2D12','#FB923C','#FDBA74','#FFF7ED','#FED7AA'],
      ['#FFFBEB','#CA8A04','#FDE047','#713F12','#78350F'],
      ['#FFF0F6','#EC4899','#F9A8D4','#831843','#9D174D'],
      ['#F0FDF4','#22C55E','#86EFAC','#14532D','#166534'],
      ['#ECFEFF','#06B6D4','#67E8F9','#164E63','#0E7490'],
      ['#FFF1F2','#F43F5E','#FDA4AF','#881337','#9F1239'],
      ['#FAFAF9','#78716C','#A8A29E','#1C1917','#292524'],
      ['#EFF6FF','#3B82F6','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#F5F3FF','#7C3AED','#A78BFA','#4C1D95','#5B21B6'],
    ],
    titles: [
      ['Sunday Morning Brunch',['casual','warm','relaxed']],
      ['Amber Brunch Party',['warm','festive','casual']],
      ['Garden Brunch',['botanical','fresh','casual']],
      ['Pink Brunch Soirée',['festive','soft','feminine']],
      ['Sage Brunch Gathering',['fresh','botanical','minimal']],
      ['Teal Morning Brunch',['fresh','modern','casual']],
      ['Coral Brunch Party',['vibrant','festive','fun']],
      ['Stone & Ivory Brunch',['minimal','sophisticated','elegant']],
      ['Sky Brunch Gathering',['fresh','airy','casual']],
      ['Violet Brunch Social',['elegant','festive','modern']],
    ],
    copies: [
      ['Brunch Invitation','Join us for Sunday Brunch!','Come for the food, stay for the stories — a relaxed morning of brunch and good company','📅 Sunday, 22nd February 2026\n⏰ 10:30 AM – 1:30 PM\n📍 Starbucks Reserve, Bandra\nMumbai, Maharashtra','Brunch & Free-Flowing Mimosas · RSVP: +91 99001 23344'],
      ['Brunch Party!','You\'re Invited to Brunch','Eggs, avocado, great coffee and even better company — join us!','📅 Sunday, 8th March 2026\n⏰ 11:00 AM\n📍 Pebble Street Café\nBengaluru, Karnataka','Brunch Menu · RSVP: +91 98765 99001'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── COCKTAIL PARTY ────────
  {
    slug: 'cocktail-party',
    pals: [
      ['#0F0A1E','#6366F1','#818CF8','#A5B4FC','#C7D2FE'],
      ['#EEF2FF','#4F46E5','#818CF8','#312E81','#4338CA'],
      ['#111827','#FCD34D','#F59E0B','#FEF9C3','#FDE68A'],
      ['#1C1300','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#0F172A','#EC4899','#F9A8D4','#FDF2F8','#FCE7F3'],
      ['#FDF2F8','#BE185D','#F9A8D4','#831843','#9D174D'],
      ['#0C4A6E','#38BDF8','#7DD3FC','#E0F2FE','#BAE6FD'],
      ['#1C0010','#F43F5E','#FB7185','#FFF1F2','#FFE4E6'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#1A0A2E','#A855F7','#C084FC','#F3E8FF','#E9D5FF'],
    ],
    titles: [
      ['Rooftop Cocktail Evening',['sophisticated','modern','minimal']],
      ['Indigo Cocktail Soirée',['elegant','modern','classic']],
      ['Golden Hour Cocktails',['warm','luxe','sophisticated']],
      ['Amber Cocktail Night',['warm','elegant','festive']],
      ['Midnight Rose Cocktails',['romantic','dark','sophisticated']],
      ['Pink Cocktail Evening',['elegant','festive','fun']],
      ['Ocean Breeze Cocktails',['fresh','modern','casual']],
      ['Crimson Cocktail Night',['bold','festive','elegant']],
      ['Emerald Garden Cocktails',['botanical','fresh','elegant']],
      ['Violet Cocktail Gala',['sophisticated','festive','modern']],
    ],
    copies: [
      ['Cocktail Evening','An Exclusive Invitation','You are cordially invited to an elegant evening of craft cocktails and fine company','📅 Saturday, 21st March 2026\n⏰ 8:00 PM\n📍 Sky Lounge, DLF Cyberhub\nGurgaon, Haryana','Craft Cocktails · Canapés · Jazz · RSVP: Aryan +91 99110 22334'],
      ['Cocktail Party Invitation','An Evening with Friends','Join us for an evening of curated cocktails, delicious bites and great conversation','📅 Friday, 27th March 2026\n⏰ 7:30 PM\n📍 Negroni Rooftop Bar\nBandra, Mumbai','Cocktails & Canapés · RSVP: +91 98765 55678'],
    ],
    prices: [49,99,29,0,149],
  },
  // ──────── GRADUATION ────────
  {
    slug: 'graduation',
    pals: [
      ['#EFF6FF','#1D4ED8','#93C5FD','#1E3A8A','#2563EB'],
      ['#0F172A','#6366F1','#818CF8','#E0E7FF','#C7D2FE'],
      ['#1C1300','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#FFFBEB','#B45309','#FCD34D','#78350F','#92400E'],
      ['#F5F3FF','#7C3AED','#C4B5FD','#4C1D95','#5B21B6'],
      ['#2E1065','#A78BFA','#C4B5FD','#EDE9FE','#DDD6FE'],
      ['#F0FDF4','#059669','#34D399','#064E3B','#065F46'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#BE185D'],
      ['#FAFAFA','#334155','#64748B','#0F172A','#1E293B'],
    ],
    titles: [
      ['Academic Excellence Graduation',['modern','minimal','elegant']],
      ['Midnight Scholar Celebration',['bold','modern','luxe']],
      ['Golden Graduation Party',['warm','festive','classic']],
      ['Champagne Graduation Gala',['luxe','festive','elegant']],
      ['Lavender Graduation Day',['soft','elegant','festive']],
      ['Royal Purple Graduation',['regal','bold','festive']],
      ['Emerald Success Party',['fresh','festive','elegant']],
      ['Forest Scholar Night',['botanical','elegant','festive']],
      ['Crimson Graduation Fête',['bold','festive','vibrant']],
      ['Slate Graduation Evening',['minimal','modern','sophisticated']],
    ],
    copies: [
      ['Graduation Celebration','Please join us to celebrate Rohan Mehta!','With pride and gratitude, we invite you to celebrate his graduation from IIT Bombay','📅 Saturday, 18th April 2026\n⏰ 7:00 PM\n📍 Mehta Residence, Juhu\nMumbai, Maharashtra','Dinner & Celebration · RSVP: +91 88776 65544'],
      ['Graduation Party!','Celebrating Priya\'s Achievement','A degree earned, a future awaiting — join us in honouring her incredible achievement','📅 Sunday, 26th April 2026\n⏰ 6:00 PM\n📍 The Westin Garden\nChennai, Tamil Nadu','Dinner · RSVP by 20th April · +91 97654 78901'],
    ],
    prices: [29,49,0,99,29],
  },
  // ──────── ANNIVERSARY ────────
  {
    slug: 'anniversary',
    pals: [
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#BE185D'],
      ['#1C0010','#E11D48','#FB7185','#FFF1F2','#FFE4E6'],
      ['#1C1300','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#FFFBEB','#B45309','#FDE68A','#78350F','#92400E'],
      ['#F5F3FF','#7C3AED','#C4B5FD','#4C1D95','#5B21B6'],
      ['#1E1B4B','#818CF8','#A5B4FC','#EDE9FE','#C7D2FE'],
      ['#ECFDF5','#059669','#6EE7B7','#064E3B','#047857'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#EFF6FF','#2563EB','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#FDF4FF','#A21CAF','#E879F9','#701A75','#86198F'],
    ],
    titles: [
      ['Silver Wedding Anniversary',['elegant','romantic','classic']],
      ['Crimson Love Anniversary',['bold','romantic','passionate']],
      ['Golden Anniversary Gala',['luxe','classic','warm']],
      ['Amber Love Celebration',['warm','romantic','festive']],
      ['Lavender Anniversary',['soft','romantic','elegant']],
      ['Celestial Anniversary Night',['modern','luxe','romantic']],
      ['Emerald 25 Years Together',['botanical','elegant','milestone']],
      ['Forest of Love Anniversary',['botanical','romantic','warm']],
      ['Sapphire Years Together',['elegant','milestone','classic']],
      ['Orchid Anniversary Night',['exotic','romantic','festive']],
    ],
    copies: [
      ['25 Years of Love','Mr. & Mrs. Suresh Kumar','Two hearts, one journey, 25 beautiful years — please join us as we celebrate our silver anniversary','📅 Saturday, 28th February 2026\n⏰ 7:00 PM\n📍 The Oberoi Ballroom\nChennai, Tamil Nadu','Renewing vows · Dinner · Dress: Formal · RSVP: +91 98400 55566'],
      ['10 Years Together','Celebrating Nikhil & Shreya','A decade of love, laughter and memories — join us for our 10th anniversary celebration','📅 Saturday, 14th March 2026\n⏰ 7:30 PM\n📍 Taj Falaknuma Palace\nHyderabad','Dinner & Dancing · RSVP by 8th March · +91 99887 11223'],
    ],
    prices: [99,149,49,29,0],
  },
  // ──────── RETIREMENT ────────
  {
    slug: 'retirement',
    pals: [
      ['#FFFBEB','#D97706','#FDE68A','#92400E','#B45309'],
      ['#1C1000','#D97706','#FCD34D','#FEF3C7','#FDE68A'],
      ['#F0FDF4','#059669','#6EE7B7','#064E3B','#047857'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#EFF6FF','#1D4ED8','#93C5FD','#1E3A8A','#2563EB'],
      ['#0F172A','#6366F1','#818CF8','#E0E7FF','#C7D2FE'],
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#9F1239'],
      ['#FDF2F8','#BE185D','#F9A8D4','#831843','#9D174D'],
      ['#F5F3FF','#7C3AED','#C4B5FD','#4C1D95','#5B21B6'],
      ['#FAFAFA','#475569','#94A3B8','#0F172A','#1E293B'],
    ],
    titles: [
      ['Joyful Retirement Party',['warm','celebratory','classic']],
      ['Golden Years Farewell',['luxe','warm','festive']],
      ['Garden Retirement Party',['botanical','fresh','warm']],
      ['Emerald Retirement Night',['elegant','festive','warm']],
      ['Sapphire Retirement Gala',['elegant','professional','festive']],
      ['Midnight Retirement Gala',['bold','festive','sophisticated']],
      ['Crimson Farewell Evening',['bold','warm','festive']],
      ['Rose Retirement Dinner',['soft','elegant','warm']],
      ['Violet Retirement Party',['elegant','festive','warm']],
      ['Silver Retirement Soirée',['minimal','elegant','sophisticated']],
    ],
    copies: [
      ['Retirement Party!','Celebrating 35 Years of Mr. Ramesh Nair','A legendary career deserves a legendary celebration — join us to honour a true champion','📅 Friday, 31st January 2026\n⏰ 6:30 PM\n📍 ITC Hotel Grand\nKochi, Kerala','Felicitation · Dinner · Musical Evening · RSVP: +91 94470 88756'],
      ['Retirement Celebration','Bidding Farewell to Dr. Anita Sharma','35 years of healing, teaching and inspiring — join us to celebrate a remarkable career','📅 Saturday, 28th February 2026\n⏰ 6:00 PM\n📍 Radisson Blu\nPune, Maharashtra','Awards · Dinner · RSVP by 20th February · +91 97654 33445'],
    ],
    prices: [29,49,0,99,29],
  },
  // ──────── HOUSEWARMING ────────
  {
    slug: 'housewarming',
    pals: [
      ['#ECFDF5','#059669','#6EE7B7','#064E3B','#047857'],
      ['#064E3B','#34D399','#6EE7B7','#D1FAE5','#A7F3D0'],
      ['#FFF7ED','#D97706','#FDBA74','#7C2D12','#92400E'],
      ['#1C1000','#F59E0B','#FCD34D','#FEF9C3','#FEF3C7'],
      ['#FFF1F2','#E11D48','#FECDD3','#881337','#9F1239'],
      ['#FDF2F8','#BE185D','#F9A8D4','#831843','#9D174D'],
      ['#EFF6FF','#2563EB','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#0F172A','#6366F1','#818CF8','#E0E7FF','#C7D2FE'],
      ['#FFFBEB','#CA8A04','#FDE047','#713F12','#78350F'],
      ['#F5F3FF','#7C3AED','#C4B5FD','#4C1D95','#5B21B6'],
    ],
    titles: [
      ['Griha Pravesh Ceremony',['traditional','devotional','warm']],
      ['Emerald Housewarming',['botanical','fresh','warm']],
      ['Golden New Home Puja',['traditional','warm','festive']],
      ['Amber Housewarming Party',['warm','festive','classic']],
      ['Crimson Griha Pravesh',['bold','traditional','festive']],
      ['Blossom Housewarming',['floral','soft','warm']],
      ['Sapphire New Home Party',['elegant','fresh','modern']],
      ['Midnight Housewarming',['bold','modern','sophisticated']],
      ['Sunrise Griha Pravesh',['warm','traditional','sacred']],
      ['Lavender Home Blessing',['soft','elegant','sacred']],
    ],
    copies: [
      ['Griha Pravesh Ceremony','The Patel Family Invites You','With gratitude and joy, we invite your blessings as we enter our new home','📅 Thursday, 9th April 2026\n⏰ Morning Puja: 8:00 AM · Lunch: 12:00 PM\n📍 Plot 45, Sector 9\nGurugram, Haryana','Your presence is our greatest gift · RSVP: +91 90000 11122'],
      ['Housewarming Party!','The Sharma Family','Come share in our joy — our new home is ready to welcome you with open doors','📅 Sunday, 19th April 2026\n⏰ 6:00 PM\n📍 Villa No. 7, Green Park\nBengaluru, Karnataka','Puja · Dinner · RSVP: +91 98765 33445'],
    ],
    prices: [0,29,49,0,29],
  },
  // ──────── POOL PARTY ────────
  {
    slug: 'pool-party',
    pals: [
      ['#F0F9FF','#0EA5E9','#38BDF8','#0C4A6E','#075985'],
      ['#0C4A6E','#38BDF8','#7DD3FC','#E0F2FE','#BAE6FD'],
      ['#ECFEFF','#06B6D4','#22D3EE','#164E63','#0E7490'],
      ['#164E63','#22D3EE','#67E8F9','#ECFEFF','#CFFAFE'],
      ['#FFF0F6','#EC4899','#F9A8D4','#831843','#BE185D'],
      ['#F0FDF4','#16A34A','#86EFAC','#14532D','#166534'],
      ['#FEFCE8','#CA8A04','#FDE047','#713F12','#92400E'],
      ['#FFF7ED','#EA580C','#FDBA74','#7C2D12','#9A3412'],
      ['#F5F3FF','#8B5CF6','#C4B5FD','#4C1D95','#5B21B6'],
      ['#EEF2FF','#4F46E5','#818CF8','#312E81','#4338CA'],
    ],
    titles: [
      ['Summer Splash Pool Party',['fun','colorful','casual']],
      ['Ocean Blue Pool Bash',['coastal','vibrant','fun']],
      ['Teal Waves Pool Party',['fresh','fun','vibrant']],
      ['Aqua Dream Pool Party',['fresh','playful','vibrant']],
      ['Pink Flamingo Pool Party',['fun','vibrant','festive']],
      ['Tropical Green Pool Party',['tropical','fun','vibrant']],
      ['Sunshine Pool Party',['bright','fun','casual']],
      ['Saffron Summer Splash',['warm','festive','fun']],
      ['Lavender Pool Gathering',['elegant','fun','festive']],
      ['Indigo Pool Party',['modern','fun','vibrant']],
    ],
    copies: [
      ['Pool Party!','The Malhotra Family Annual Summer Splash!','Get your swimsuits and sunscreen — it\'s that time of the year again!','📅 Sunday, 26th May 2026\n⏰ 11:00 AM – 6:00 PM\n📍 Sapphire Springs Resort\nLonavala, Maharashtra','Pool Games · BBQ · Music · Kids Welcome! · RSVP: +91 95432 10987'],
      ['Summer Pool Party!','Join the Khanna Family!','Make a splash with us — a day of pool fun, great food and great friends!','📅 Saturday, 6th June 2026\n⏰ 11:00 AM – 5:00 PM\n📍 The Imperial Pool Club\nNew Delhi','Poolside BBQ · Mocktails · DJ · RSVP: +91 98765 44678'],
    ],
    prices: [29,0,49,29,0],
  },
  // ──────── NEW YEAR ────────
  {
    slug: 'new-year',
    pals: [
      ['#111827','#FCD34D','#F59E0B','#FEF9C3','#FDE68A'],
      ['#FFFBEB','#B45309','#FCD34D','#78350F','#92400E'],
      ['#0F172A','#6366F1','#818CF8','#E0E7FF','#C7D2FE'],
      ['#EEF2FF','#4F46E5','#818CF8','#312E81','#4338CA'],
      ['#1C0010','#E11D48','#FB7185','#FFF1F2','#FFE4E6'],
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#9F1239'],
      ['#0F172A','#10B981','#34D399','#D1FAE5','#A7F3D0'],
      ['#ECFDF5','#059669','#6EE7B7','#064E3B','#047857'],
      ['#1E1B4B','#A5B4FC','#C7D2FE','#EDE9FE','#DDD6FE'],
      ['#1A0A2E','#A855F7','#C084FC','#F3E8FF','#E9D5FF'],
    ],
    titles: [
      ['New Year Eve Extravaganza',['bold','modern','festive']],
      ['Golden New Year Gala',['luxe','festive','warm']],
      ['Midnight Stars New Year',['celestial','bold','luxe']],
      ['Sapphire New Year\'s Eve',['elegant','festive','modern']],
      ['Crimson Countdown Party',['bold','festive','vibrant']],
      ['Rose Gold New Year Party',['elegant','festive','romantic']],
      ['Emerald New Year Bash',['fresh','festive','modern']],
      ['Garden New Year Night',['botanical','festive','elegant']],
      ['Celestial New Year\'s Eve',['modern','celestial','luxe']],
      ['Violet Countdown Night',['sophisticated','festive','luxe']],
    ],
    copies: [
      ['New Year 2027!','Ring in the New Year with the Kapoor Family','Countdown to midnight with us — let\'s bid farewell to 2026 and welcome 2027 in style!','📅 Wednesday, 31st December 2026\n⏰ 9:00 PM – 2:00 AM\n📍 Rooftop Garden, The Westin\nGurgaon, Haryana','Cocktails · DJ · Midnight Fireworks · Dinner · RSVP: +91 99001 23344'],
      ['Happy New Year!','New Year Celebration Party','Join us as we count down to a brand new year filled with hope, joy and endless possibilities','📅 Thursday, 31st December 2026\n⏰ 9:00 PM\n📍 The Sky Bar, ITC Grand\nBengaluru, Karnataka','Open Bar · Live Band · Fireworks · RSVP: +91 98765 88990'],
    ],
    prices: [49,99,29,149,0],
  },
  // ──────── VALENTINE'S DAY ────────
  {
    slug: 'valentines-day',
    pals: [
      ['#FFF1F2','#E11D48','#F9A8D4','#831843','#BE185D'],
      ['#1C0010','#E11D48','#FB7185','#FFF1F2','#FFE4E6'],
      ['#FDF2F8','#BE185D','#F9A8D4','#831843','#9D174D'],
      ['#831843','#F472B6','#FBCFE8','#FFF0F6','#FCE7F3'],
      ['#FFFBEB','#D97706','#FDE68A','#92400E','#B45309'],
      ['#1C1300','#F59E0B','#FCD34D','#FEF9C3','#FDE68A'],
      ['#F5F3FF','#8B5CF6','#C4B5FD','#4C1D95','#5B21B6'],
      ['#2E1065','#C084FC','#E9D5FF','#F3E8FF','#FAE8FF'],
      ['#EFF6FF','#3B82F6','#93C5FD','#1E3A8A','#1D4ED8'],
      ['#0F172A','#EC4899','#F9A8D4','#FDF2F8','#FCE7F3'],
    ],
    titles: [
      ['Romantic Valentine\'s Dinner',['romantic','elegant','intimate']],
      ['Crimson Valentine\'s Night',['bold','romantic','passionate']],
      ['Rose Blossom Valentine\'s',['floral','romantic','soft']],
      ['Cherry Valentine\'s Eve',['romantic','playful','festive']],
      ['Golden Hearts Valentine\'s',['warm','romantic','classic']],
      ['Amber Valentine\'s Evening',['warm','romantic','cozy']],
      ['Lavender Valentine\'s Date',['soft','romantic','elegant']],
      ['Violet Valentine\'s Night',['mysterious','romantic','luxe']],
      ['Sky Blue Valentine\'s',['fresh','romantic','modern']],
      ['Midnight Rose Valentine\'s',['dark','romantic','luxe']],
    ],
    copies: [
      ['Happy Valentine\'s Day!','A Special Evening for Two','You make every day Valentine\'s Day — tonight, let\'s make it extra special','📅 Saturday, 14th February 2026\n⏰ 7:30 PM\n📍 Olive Bar & Kitchen, Mehrauli\nNew Delhi','Candlelit Dinner · Wine · RSVP: +91 98765 22334'],
      ['Valentine\'s Day Celebration','An Evening of Love & Romance','Love is in the air — join us for a Valentine\'s celebration with those who matter most','📅 Saturday, 14th February 2026\n⏰ 7:00 PM\n📍 The Taj Mahal Restaurant\nMumbai, Maharashtra','Valentine\'s Set Menu · RSVP: +91 22 6665 4444'],
    ],
    prices: [49,99,29,0,149],
  },
]

// ─── Template generator ───────────────────────────────────────────────────────

function makeTemplate(slug: string, i: number, p: Pal, td: TD, cp: CP, price: number, uid: number): Template {
  const layoutIdx = i % 5
  const orientation: Template['orientation'] = ORIENTATIONS[layoutIdx]
  const fabric = LAYOUTS[layoutIdx](p, cp)
  return {
    id: `tpl-${String(uid).padStart(4, '0')}`,
    occasion_slug: slug,
    title: td[0],
    style_tags: td[1],
    colour_palette: [p[1], p[2], p[0], p[3]],
    orientation,
    price_inr: price,
    preview_url: null,
    hd_template_url: null,
    fabric_json: fabric,
    ai_prompt: `${td[0]} invitation for ${slug}`,
    is_active: true,
    created_at: `2026-${String(Math.floor(uid / 30) + 1).padStart(2, '0')}-${String((uid % 28) + 1).padStart(2, '0')}T00:00:00Z`,
  }
}

function generate(): Template[] {
  const out: Template[] = []
  let uid = 1
  for (const spec of SPECS) {
    for (let i = 0; i < 10; i++) {
      out.push(makeTemplate(
        spec.slug,
        i,
        spec.pals[i % spec.pals.length],
        spec.titles[i % spec.titles.length],
        spec.copies[i % spec.copies.length],
        spec.prices[i % spec.prices.length],
        uid++,
      ))
    }
  }
  return out
}

export const MOCK_TEMPLATES: Template[] = generate()
