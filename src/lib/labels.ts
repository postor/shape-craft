export function categoryLabel(c: string): string {
  const map: Record<string, string> = {
    tree: '树',
    flower: '花',
    grass: '草',
    house: '房子',
    rock: '石头',
    road: '道路',
    decor: '装饰',
    character: '角色',
    waterfall: '瀑布',
    other: '其他',
  };
  return map[c] ?? c;
}
