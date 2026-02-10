
import { CopybookConfig, GridType } from './types';

export const DEFAULT_CONFIG: CopybookConfig = {
  gridType: GridType.TIAN,
  lineStyle: 'dashed',
  pinyinSize: 14,
  charSize: 42,
  gridSize: 60,
  gridSpacing: 1,
  wordGap: 15,
  rowSpacing: 15,
  shadowColor: '#d1d5db',
  gridColor: '#94a3b8',
  showPinyin: true,
};

export const COLOR_OPTIONS = [
  { name: '银灰', value: '#d1d5db' },
  { name: '浅红', value: '#fca5a5' },
  { name: '朱红', value: '#ef4444' },
  { name: '薄荷', value: '#86efac' },
  { name: '岩灰', value: '#64748b' },
];

export const GRID_COLORS = [
  { name: '浅色', value: '#e2e8f0' },
  { name: '标准', value: '#94a3b8' },
  { name: '纯黑', value: '#000000' },
  { name: '主题蓝', value: '#6366f1' },
];

export const A4_WIDTH_MM = 210;
export const A4_HEIGHT_MM = 297;
export const PAGE_PADDING_MM = 15;
export const HEADER_HEIGHT_MM = 25;
export const PX_TO_MM = 0.264583;
