
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Download, 
  Settings2, 
  Sparkles, 
  History, 
  Trash2, 
  Printer,
  ChevronRight,
  ChevronLeft,
  BookOpen
} from 'lucide-react';
import { CopybookConfig, CharacterItem, PageData, GridType } from './types';
import { DEFAULT_CONFIG, PX_TO_MM, A4_WIDTH_MM, A4_HEIGHT_MM, PAGE_PADDING_MM, HEADER_HEIGHT_MM } from './constants';
import { getPinyinArray } from './services/pinyinService';
import { generateContent } from './services/geminiService';
import ConfigPanel from './components/ConfigPanel';
import PreviewArea from './components/PreviewArea';

const App: React.FC = () => {
  const [title, setTitle] = useState('沫渣特默写字帖');
  const [inputText, setInputText] = useState('勤* 学* 苦* 练* 积* 极* 向* 上* 自* 强* 不* 息*');
  const [config, setConfig] = useState<CopybookConfig>(DEFAULT_CONFIG);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // 将原始文本转换为结构化的字符项
  const [wordGroups, setWordGroups] = useState<CharacterItem[][]>([]);

  useEffect(() => {
    const processInput = async () => {
      const groups = inputText.trim().split(/\s+/);
      const processedGroups: CharacterItem[][] = [];

      for (const group of groups) {
        const pureText = group.replace(/\*/g, '');
        const pinyins = await getPinyinArray(pureText);
        
        const chars: CharacterItem[] = [];
        let pinyinIdx = 0;
        for (let i = 0; i < group.length; i++) {
          if (group[i] === '*') continue;
          const char = group[i];
          const showChar = group[i + 1] === '*';
          chars.push({
            id: `char-${Math.random().toString(36).substr(2, 9)}`,
            char,
            showChar,
            pinyin: pinyins[pinyinIdx] || '',
          });
          pinyinIdx++;
        }
        processedGroups.push(chars);
      }
      setWordGroups(processedGroups);
    };

    const timeout = setTimeout(processInput, 300);
    return () => clearTimeout(timeout);
  }, [inputText]);

  // 分页逻辑
  const pagedData = useMemo(() => {
    const usableWidthMm = A4_WIDTH_MM - (PAGE_PADDING_MM * 2);
    const usableHeightMm = A4_HEIGHT_MM - (PAGE_PADDING_MM * 2);
    
    const charWidthMm = (config.gridSize + config.gridSpacing) * PX_TO_MM;
    const wordGapMm = config.wordGap * PX_TO_MM;
    const rowHeightMm = (config.pinyinSize + config.gridSize + config.rowSpacing + 5) * PX_TO_MM;

    const rows: CharacterItem[][][] = [];
    let currentRow: CharacterItem[][] = [];
    let currentRowWidthMm = 0;

    wordGroups.forEach((group) => {
      const groupWidthMm = group.length * charWidthMm;
      if (currentRowWidthMm + groupWidthMm + wordGapMm > usableWidthMm && currentRow.length > 0) {
        rows.push(currentRow);
        currentRow = [group];
        currentRowWidthMm = groupWidthMm;
      } else {
        currentRow.push(group);
        currentRowWidthMm += groupWidthMm + (currentRow.length > 1 ? wordGapMm : 0);
      }
    });
    if (currentRow.length > 0) rows.push(currentRow);

    const pages: PageData[] = [];
    let currentPageRows: CharacterItem[][][] = [];
    let currentHeightMm = HEADER_HEIGHT_MM;

    rows.forEach((row) => {
      if (currentHeightMm + rowHeightMm > usableHeightMm && currentPageRows.length > 0) {
        pages.push({ rows: currentPageRows });
        currentPageRows = [row];
        currentHeightMm = rowHeightMm;
      } else {
        currentPageRows.push(row);
        currentHeightMm += rowHeightMm;
      }
    });
    if (currentPageRows.length > 0) pages.push({ rows: currentPageRows });

    return pages;
  }, [wordGroups, config]);

  const handleAiGenerate = async (prompt: string) => {
    setIsGenerating(true);
    try {
      const phrases = await generateContent(prompt);
      if (phrases.length > 0) {
        setInputText(phrases.join(' '));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const exportPDF = () => {
    const element = document.getElementById('copybook-preview');
    if (!element || !(window as any).html2pdf) return;
    
    const opt = {
      margin: 0,
      filename: `${title.trim() || '字帖生成'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    (window as any).html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden text-slate-900">
      {/* 侧边栏配置 */}
      <aside 
        className={`${sidebarOpen ? 'w-96' : 'w-0'} transition-all duration-300 bg-white border-r border-slate-200 overflow-hidden flex flex-col no-print z-50`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <BookOpen size={22} />
            </div>
            <h1 className="font-extrabold text-xl tracking-tight text-slate-800">沫渣特 默写字帖生成器</h1>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-slate-50 rounded-lg text-slate-400"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
          <ConfigPanel 
            config={config} 
            setConfig={setConfig} 
            title={title} 
            setTitle={setTitle}
            inputText={inputText}
            setInputText={setInputText}
            onAiGenerate={handleAiGenerate}
            isGenerating={isGenerating}
          />
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 space-y-3">
          <button 
            onClick={exportPDF}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
          >
            <Download size={18} />
            导出高清 PDF
          </button>
          <button 
            onClick={() => window.print()}
            className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold py-3 px-6 rounded-xl transition-all"
          >
            <Printer size={18} />
            直接打印
          </button>
        </div>
      </aside>

      {/* 主内容区域 */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* 顶部工具栏 */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 no-print shrink-0 z-40">
          <div className="flex items-center gap-4">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg text-indigo-600 transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            )}
            <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <History size={16} />
              <span>已自动保存</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-bold border border-emerald-100">
              <Sparkles size={14} />
              AI 增强模式已就绪
            </div>
            <div className="h-6 w-[1px] bg-slate-200"></div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
              A4 页面预览
            </div>
          </div>
        </header>

        {/* 预览区域 */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-12 bg-slate-50 flex flex-col items-center custom-scrollbar">
          <PreviewArea pages={pagedData} config={config} title={title} />
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default App;
