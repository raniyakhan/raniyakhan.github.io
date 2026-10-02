// Every object in the room, back to front.
// x, y, w are percentages of the room (matched to the Canva layout).
// Objects with a section are clickable; fill in `body` with paragraphs.
import blkSolo from './assets/exp/blk_solo.webp'
import blkGroup from './assets/exp/blk_group.webp'
import amazon from './assets/exp/amazon.webp'
import unicef from './assets/exp/unicef.webp'
import unicef2 from './assets/exp/unicef_2.webp'
import rtvc from './assets/exp/rtvc.webp'
import img_rug from './assets/room/rug.webp'
import img_newspaper from './assets/room/newspaper.webp'
import img_welcome from './assets/room/welcome.webp'
import img_plate from './assets/room/plate.webp'
import img_eye from './assets/room/eye.webp'
import img_smallart from './assets/room/smallart.webp'
import img_heart from './assets/room/heart.webp'
import img_flowerprint from './assets/room/flowerprint.webp'
import img_sunset from './assets/room/sunset.webp'
import img_frame from './assets/room/frame_wall.webp'
import img_mama from './assets/room/mama_wall.webp'
import img_clock from './assets/room/clock_wall.webp'
import img_door from './assets/room/door_wall.webp'
import img_berk from './assets/room/berk.webp'
import img_self from './assets/room/self.webp'
import img_chair from './assets/room/chair.webp'
import img_shoes from './assets/room/climbingshoes.webp'
import mu_bf26mp4 from './assets/music/between-friends-2026.mp4'
import mu_nemahsisMp4 from './assets/music/nemahsis.mp4'
import mu_lordeMp4 from './assets/music/lorde.mp4'
import mu_coldplay from './assets/music/coldplay.jpg'
import mu_dailycal from './assets/music/daily-cal-lorde.jpg'
import me1 from './assets/about/me1.jpg'
import me2 from './assets/about/me2.jpg'
import me3 from './assets/about/me3.jpg'
import me5 from './assets/about/me5.jpg'
import me6 from './assets/about/me6.jpg'
import book_now from './assets/likes/story-of-a-new-name.jpg'
import fun_climbing from './assets/fun/climbing.jpg'
import fun_laser from './assets/fun/laser.jpg'
import fun_laser3 from './assets/fun/laser3.jpg'
import fun_laser4 from './assets/fun/laser4.jpg'
import fun_laserMp4 from './assets/fun/laser.mp4'
import img_table from './assets/room/table.webp'
import img_orchid from './assets/room/orchid.webp'
import img_laptop from './assets/room/laptop.webp'
import img_books from './assets/room/bookstack.webp'
import img_coffee from './assets/room/coffee.webp'
import img_phone from './assets/room/phone.webp'

export const SECTIONS = {
  about: 'about',
  experiences: 'experiences',
  projects: 'projects',
  likes: 'things i like',
  fun: 'for fun',
  contact: 'contact',
}

export const ROOM_ASPECT = 1684 / 1170

export const items = [
  { id: 'rug', src: img_rug, x: 3.3, y: 65.8, w: 95 },
  { id: 'newspaper', src: img_newspaper, x: 9.26, y: 10.43, w: 8.49, section: 'likes', title: "live music", body: ["I love live music! A selection of recent concerts I've been to:"],
    // dates come from each file's metadata (newest first); `video` lists its sources
    concerts: [
      { name: 'Between Friends', date: 'Sep 4, 2026', video: [mu_bf26mp4] },
      { name: 'Nemahsis', date: 'Apr 3, 2026', video: [mu_nemahsisMp4] },
      { name: 'Lorde', date: 'Oct 19, 2025', video: [mu_lordeMp4] },
      { name: 'Coldplay', date: 'Jul 16, 2025', photo: mu_coldplay },
    ],
    article: { src: mu_dailycal, text: "The newspaper on my wall is The Daily Californian's article from when Lorde came to the Greek Theatre at Berkeley." } },
  { id: 'welcome', src: img_welcome, x: 21.2, y: 10.43, w: 5.7, section: 'experiences', title: "moma", body: []  },
  { id: 'plate', src: img_plate, x: 20.07, y: 18.29, w: 8.73, section: 'about', title: "pennsylvania", body: []  },
  { id: 'eye', src: img_eye, x: 29.04, y: 10.17, w: 5.76, section: 'likes', title: "eye painting", body: []  },
  { id: 'smallart', src: img_smallart, x: 36.64, y: 9.83, w: 3.33, section: 'likes', title: "little print", body: []  },
  { id: 'heart', src: img_heart, x: 41.75, y: 13.25, w: 3.21, section: 'likes', title: "silver heart", body: []  },
  { id: 'flowerprint', src: img_flowerprint, x: 45.78, y: 9.4, w: 2.55, section: 'likes', title: "flower print", body: []  },
  { id: 'sunset', src: img_sunset, x: 41.81, y: 21.03, w: 6.24, section: 'likes', title: "sunset painting", body: []  },
  { id: 'frame', src: img_frame, x: 50.83, y: 9.74, w: 9.38, section: 'about', title: "my people", body: []  },
  { id: 'mama', src: img_mama, x: 61.88, y: 8.89, w: 3.09, section: 'about', title: "mama", body: []  },
  { id: 'clock', src: img_clock, x: 64.13, y: 13.68, w: 8.91, section: 'about', title: "right now", body: []  },
  { id: 'door', src: img_door, x: 75.4, y: 16.1, w: 3.3, section: 'fun', title: "laser cutting", body: [
    "Laser cutting!! I very much enjoy watching shapes I've drawn on a screen come to life as real objects.",
  ], photos: [fun_laser, fun_laser3, fun_laser4], videos: [[fun_laserMp4]] },
  { id: 'berk', src: img_berk, x: 80.76, y: 11.11, w: 3.8, section: 'experiences', title: "berkeley", body: []  },
  { id: 'self', src: img_self, opens: 'about', x: 28.15, y: 19.66, w: 16.86, section: 'about', title: "about me", body: []  },
  { id: 'chair', src: img_chair, x: 57.84, y: 39.66, w: 26.37 },
  { id: 'shoes', src: img_shoes, x: 46.5, y: 76.07, w: 12.0, section: 'fun', title: "climbing", body: [
    "I've been getting into climbing lately, mostly bouldering. It's a physical activity with a clear goal that doesn't feel purely superficial.",
    "I fall a lot, which turns out to be good for me. It's hard to take yourself too seriously when you've just slid down a wall onto a giant foam mattress for the eighth time. And failure (more broadly) feels safer.",
    "Eventually I'd like to try it outside on real rock, where the problems weren't set by anyone at all.",
  ], photos: [fun_climbing] },
  { id: 'table', src: img_table, x: 78.86, y: 60.17, w: 16.86 },
  { id: 'orchid', src: img_orchid, x: 78.4, y: 39.5, w: 12.8, section: 'fun', title: "lego", body: []  },
  { id: 'laptop', src: img_laptop, x: 84.92, y: 58.63, w: 10.81, section: 'projects', title: "projects", body: []  },
  { id: 'books', src: img_books, x: 15.08, y: 69.06, w: 11.4, section: 'likes', title: "currently reading", body: [], book: { cover: book_now, title: 'The Story of a New Name', author: 'Elena Ferrante' } },
  { id: 'coffee', src: img_coffee, x: 17.1, y: 62.39, w: 4.87, section: 'contact', title: "let's hang out", body: ["Always happy to chat about new opportunities or whatever you're excited about!"], link: { href: 'https://calendly.com/raniyakhan-berkeley/coffee-chat', label: "let's get coffee" }  },
  { id: 'phone', src: img_phone, x: 7.84, y: 78.29, w: 9.86, section: 'contact', title: "get in touch", body: ["Find me here!"], links: [
    { label: 'email', href: 'mailto:raniyakhan@berkeley.edu' },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/raniyakhan' },
    { label: 'github', href: 'https://github.com/raniyakhan' },
    { label: 'beli', href: 'https://beliapp.co/app/raniya' },
  ] },
]

// The two full pages linked from the header.
export const aboutPage = {
  title: 'about me',
  body: [
    "Hi, I'm Raniya.",
    "I'm currently a senior at UC Berkeley studying computer science and business. I've spent the last few years working in the applied AI space; I see myself as the bridge between what people need and what technology can do.",
    "I want whatever I build to make a positive impact, and I'm especially passionate about education and web affordability. Lately I've also been dabbling in whimsical, joyful UX (hopefully this website is a good example!).",
    "In my free time, you can find me crafting, climbing, or cooking :)",
  ],
  // the clickable photo stack at the bottom, top card first
  photos: [me1, me2, me3, me5, me6],
}

// One entry per job, newest first.
// `photos` are optional snapshots shown with the entry; `link` makes them clickable.
export const experiences = [
  {
    role: 'Research Intern', org: 'BlackRock AI Labs', when: 'Jun – Aug 2026', where: 'New York, NY',
    line: "I built a multi-agent workflow that reviews internal AI use cases against BlackRock's AI policies, which cut approval time by 30%.",
    photos: [blkSolo, blkGroup],
  },
  {
    role: 'Software Development Engineer Intern', org: 'Amazon AGI Customization', when: 'Jun – Aug 2025', where: 'Boston, MA',
    line: 'I worked on long-context training for the Nova LLM and packaged a prompt optimization workflow so it deploys with a fraction of the setup.',
    photos: [amazon],
  },
  {
    role: 'Undergraduate Researcher', org: 'Berkeley AI Research, Speech Group', when: 'Oct 2024 – Oct 2025', where: 'Berkeley, CA',
    line: 'I co-authored RT-VC, a real-time voice conversion system, and worked on making articulatory speech synthesis faster and lighter.',
    photos: [rtvc], link: 'https://arxiv.org/abs/2506.10289',
  },
  {
    role: 'Technical Project Manager', org: 'UNICEF', when: 'Sep 2024 – Jan 2025', where: 'Berkeley, CA',
    line: 'I led a team of five building a course recommendation system for a learning platform that serves 6 million students.',
    photos: [unicef, unicef2],
  },
  {
    role: 'Software Engineer Intern', org: 'Lynxius', when: 'May – Aug 2024', where: 'San Francisco, CA',
    line: "I built a tool that grades AI answers the way a person would, and the blog on Lynxius's website.",
  },
  {
    role: 'Software Engineer Consultant', org: 'TED Conferences', when: 'Jan – Jun 2024', where: 'Remote',
    line: 'I built a chatbot that answers questions using the transcripts of TED talks.',
  },
]
