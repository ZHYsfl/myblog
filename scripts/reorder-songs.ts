import fs from 'node:fs';

const ORDER: string[] = [
  'Supermarket Flowers',
  '画(Live-Piano-Session-Ⅱ)',
  '形容',
  'I Really Like You',
  '飞翔吧少年',
  '爱无所不在',
  '她的睫毛',
  '等风吹来',
  '慢热',
  'Valentine‘s Day',
  '有些',
  '时空交界',
  '想见你想见你想见你',
  '玫瑰星云',
  '玻璃',
  '我也不知道',
  '后会无期',
  '那个他(Remaster)',
  '我只能离开',
  '等不到你',
  '当你',
  '趁黑夜偷走繁星',
  'Cruel Summer',
  '专属天使',
  '时空观影券',
  '收敛',
  '花海',
  '直觉',
  '树读',
  '你的降临',
  '对的人',
  '稻香',
  'U Make Me Wanna',
  '就不告诉你',
  '唯你懂我心',
  '就忘了吧',
  '勇敢爱',
  '幸福是被你需要',
  '占有',
  '天天',
  '飞机场的1030',
  '达尔文',
  '爱爱爱',
  '不再联系',
  '晴天',
  '起风了',
  '少年那时歌',
  '跳楼机',
  'Our Story',
  '公园',
  '清空',
  'Die For You',
  '恋爱达人',
  '给你呀',
  '我们的明天',
  '明明(深爱着你)',
  '输入法打可爱按第五',
  '不想做朋友',
  '角落里的光',
  '静悄悄',
  '美人鱼',
  '和你',
  '认输',
  '勾指起誓',
  '瞬',
  '爱怎么回不来',
  '世间美好与你环环相扣',
  '我的711',
  '某某',
  '爱错',
  '甜而不腻',
  'The Way I Still Love You',
  '三人游',
  '有没有',
  '关于爱的定义',
  '你不在',
  '哪里都是你',
  '兄妹',
  '龙卷风',
  '只欠一句 我爱你',
  '我会等',
  '退后',
  '偏爱',
  '笑着流泪',
  '蝴蝶',
  'Bad Girl',
  '如果成为你',
  '好安静',
  'Now or Never',
  '心乱飞',
  '坏女孩',
  '万有引力',
  '我不配',
  '会长大的幸福',
  '就是爱你',
  'I Hate Falling In Love',
  '爱在',
  '骂醒我',
  '大笨钟',
  '暗恋',
  'So Sick',
  '意外',
  '其实都没有',
  '宿',
  '淋一场雨',
  '手拖手',
  '缝',
  'Broken and Scared',
  '好天气',
  'Jasmine',
  '星光降落',
  '娃娃脸',
];

function normalize(t: string): string {
  return t
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[-_/]/g, '')
    .replace(/[()（）]/g, '')
    .replace(/[’‘'\"]/g, '')
    .replace(/[Ⅱ]/g, 'ii');
}

const songs = JSON.parse(fs.readFileSync('src/data/songs.json', 'utf8')) as { title: string }[];
const map = new Map(songs.map((s) => [normalize(s.title), s]));
const ordered: typeof songs = [];
for (const title of ORDER) {
  const key = normalize(title);
  const s = map.get(key);
  if (!s) {
    // fuzzy fallback
    const found = songs.find(
      (x) => normalize(x.title).includes(key) || key.includes(normalize(x.title))
    );
    if (found) {
      ordered.push(found);
      map.delete(normalize(found.title));
      continue;
    }
    throw new Error(`Missing song: ${title}`);
  }
  ordered.push(s);
  map.delete(key);
}
const remaining = songs.filter((s) => !ordered.includes(s));
const final = [...ordered, ...remaining];
console.log(`Reordered ${ordered.length} songs, ${remaining.length} remaining.`);
fs.writeFileSync('src/data/songs.json', JSON.stringify(final, null, 2), 'utf8');
