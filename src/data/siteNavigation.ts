import { routes } from '../utils/routes';

// `hint` is the one-line description shown next to each item in the INDEX menu.
export const navLinks = [
  { href: routes.records, label: '기록', hint: '지금까지 쓴 글' },
  { href: routes.series, label: '시리즈', hint: '이어서 읽는 글 묶음' },
  { href: routes.creations, label: '창작', hint: 'AI로 만든 노래' },
  { href: routes.career, label: '이력', hint: '일해 온 곳과 맡은 일' },
  { href: routes.about, label: '소개', hint: '일하고 생각하는 방식' },
  { href: routes.manyangGureum, label: '만냥구름', hint: '같이 사는 고양이 둘' },
  { href: routes.search, label: '검색', hint: '단어로 글 찾기' },
];
