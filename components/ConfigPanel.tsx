
import React, { useState } from 'react';
import { 
  Type, 
  LayoutGrid, 
  Palette, 
  MousePointer2, 
  Sparkles,
  RefreshCw,
  Info,
  ChevronRight
} from 'lucide-react';
import { CopybookConfig, GridType } from '../types';
import { COLOR_OPTIONS, GRID_COLORS } from '../constants';

interface ConfigPanelProps {
  config: CopybookConfig;
  setConfig: (config: CopybookConfig) => void;
  title: string;
  setTitle: (t: string) => void;
  inputText: string;
  setInputText: (t: string) => void;
  onAiGenerate: (prompt: string) => void;
  isGenerating: boolean;
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ 
  config, setConfig, title, setTitle, inputText, setInputText, onAiGenerate, isGenerating 
}) => {
  const [aiPrompt, setAiPrompt] = useState('');

  const updateConfig = (key: keyof CopybookConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* 标题与输入部分 */}
      <div className="space-y-4">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Type size={14} className="text-indigo-500" /> 页面主标题
        </label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="输入字帖标题..."
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
        />

        <div className="flex items-center justify-between pt-2">
          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <LayoutGrid size={14} className="text-indigo-500" /> 练习内容
          </label>
          <div className="flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100 font-bold">
            <Info size={10} /> 加 '*' 开启描红
          </div>
        </div>
        <textarea 
          rows={5} 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)}
          placeholder="例如：学习* 进步* 勤奋* 聪明*"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none transition-all font-medium leading-relaxed"
        />
        <p className="text-[10px] text-slate-400 mt-1">
          注：词语间请用空格分隔。
        </p>
      </div>

      {/* AI 助手 */}
      <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-4">
        <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-tight">
          <Sparkles size={16} /> AI 内容助手
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            placeholder="输入主题：如“大自然”、“古诗词”"
            className="flex-1 bg-white border border-indigo-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button 
            disabled={isGenerating || !aiPrompt}
            onClick={() => onAiGenerate(aiPrompt)}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white p-2 rounded-lg transition-colors flex items-center justify-center"
          >
            {isGenerating ? <RefreshCw size={16} className="animate-spin" /> : <ChevronRight size={16} />}
          </button>
        </div>
        <p className="text-[10px] text-indigo-400 font-medium">使用 AI 一键生成有意义的练习内容。</p>
      </div>

      {/* 网格样式 */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">网格排版配置</label>
        
        <div className="grid grid-cols-3 gap-2">
          {(Object.values(GridType) as GridType[]).map((type) => (
            <button
              key={type}
              onClick={() => updateConfig('gridType', type)}
              className={`py-2 px-1 rounded-lg border text-[10px] font-bold transition-all uppercase tracking-tighter ${config.gridType === type ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}`}
            >
              {type === GridType.TIAN ? '田字格' : type === GridType.MI ? '米字格' : '空白格'}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => updateConfig('lineStyle', 'solid')}
            className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${config.lineStyle === 'solid' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            实线网格
          </button>
          <button
            onClick={() => updateConfig('lineStyle', 'dashed')}
            className={`py-2 rounded-lg border text-[10px] font-bold transition-all ${config.lineStyle === 'dashed' ? 'bg-slate-800 text-white' : 'bg-white text-slate-500 border-slate-200'}`}
          >
            虚线网格
          </button>
        </div>
      </div>

      {/* 滑块设置 */}
      <div className="space-y-6 pt-4 border-t border-slate-100">
        <RangeInput label="格子大小" value={config.gridSize} min={40} max={120} onChange={(v) => updateConfig('gridSize', v)} />
        <RangeInput label="汉字字号" value={config.charSize} min={20} max={100} onChange={(v) => updateConfig('charSize', v)} />
        <RangeInput label="拼音字号" value={config.pinyinSize} min={8} max={32} onChange={(v) => updateConfig('pinyinSize', v)} />
        <RangeInput label="词间距" value={config.wordGap} min={0} max={100} onChange={(v) => updateConfig('wordGap', v)} />
        <RangeInput label="行间距" value={config.rowSpacing} min={5} max={80} onChange={(v) => updateConfig('rowSpacing', v)} />
      </div>

      {/* 颜色设置 */}
      <div className="space-y-4 pt-4 border-t border-slate-100">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Palette size={14} className="text-indigo-500" /> 描红文字颜色
        </label>
        <div className="flex gap-2.5">
          {COLOR_OPTIONS.map((col) => (
            <button
              key={col.value}
              onClick={() => updateConfig('shadowColor', col.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${config.shadowColor === col.value ? 'border-indigo-600 scale-110 shadow-lg' : 'border-white shadow-sm'}`}
              style={{ backgroundColor: col.value }}
              title={col.name}
            />
          ))}
        </div>

        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 pt-2">
          <LayoutGrid size={14} className="text-indigo-500" /> 格线颜色
        </label>
        <div className="flex gap-2.5">
          {GRID_COLORS.map((col) => (
            <button
              key={col.value}
              onClick={() => updateConfig('gridColor', col.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${config.gridColor === col.value ? 'border-indigo-600 scale-110 shadow-lg' : 'border-white shadow-sm'}`}
              style={{ backgroundColor: col.value }}
              title={col.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const RangeInput = ({ label, value, min, max, onChange }: { label: string, value: number, min: number, max: number, onChange: (v: number) => void }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-tight px-1">
      <span>{label}</span>
      <span className="text-indigo-600 font-mono">{value}px</span>
    </div>
    <input 
      type="range" 
      min={min} 
      max={max} 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

export default ConfigPanel;
