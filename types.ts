
export enum GridType {
  TIAN = 'tian',
  MI = 'mi',
  EMPTY = 'empty'
}

export interface CopybookConfig {
  gridType: GridType;
  lineStyle: 'dashed' | 'solid';
  pinyinSize: number;
  charSize: number;
  gridSize: number;
  gridSpacing: number;
  wordGap: number;
  rowSpacing: number;
  shadowColor: string;
  gridColor: string;
  showPinyin: boolean;
}

export interface CharacterItem {
  id: string;
  char: string;
  showChar: boolean;
  pinyin: string;
}

export type WordGroup = CharacterItem[];

export interface PageData {
  rows: WordGroup[][];
}
