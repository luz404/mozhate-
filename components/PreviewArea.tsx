
import React from 'react';
import { PageData, CopybookConfig, GridType } from '../types';

interface PreviewAreaProps {
  pages: PageData[];
  config: CopybookConfig;
  title: string;
}

const PreviewArea: React.FC<PreviewAreaProps> = ({ pages, config, title }) => {
  return (
    <div id="copybook-preview" className="flex flex-col gap-10 items-center">
      {pages.map((page, idx) => (
        <div 
          key={idx}
          className="bg-white shadow-2xl relative flex flex-col box-border border border-slate-200"
          style={{ 
            width: '210mm', 
            minHeight: '297mm', 
            padding: '15mm',
            backgroundColor: '#ffffff'
          }}
        >
          {/* 页面页眉（仅第一页） */}
          {idx === 0 && (
            <div className="flex justify-between items-end border-b-[3px] border-slate-900 pb-4 mb-10">
              <div>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-none">{title}</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-2">沫渣特系列 • 汉字默写练习字帖</p>
              </div>
              <div className="flex gap-10 text-sm font-bold text-slate-800 italic pr-4">
                <span>姓名: __________</span>
                <span>得分: ______</span>
              </div>
            </div>
          )}

          {/* 行容器 */}
          <div className="flex flex-col flex-1" style={{ gap: `${config.rowSpacing}px` }}>
            {page.rows.map((row, rIdx) => (
              <div key={rIdx} className="flex flex-wrap items-end" style={{ gap: `${config.wordGap}px` }}>
                {row.map((group, gIdx) => (
                  <div key={gIdx} className="flex" style={{ gap: `${config.gridSpacing}px` }}>
                    {group.map((item) => (
                      <div key={item.id} className="flex flex-col items-center">
                        {/* 拼音：取消 italic 避免某些字体下 'n' 被遮挡，增加 overflow-visible */}
                        <div 
                          className="text-slate-900 font-bold text-center leading-none whitespace-nowrap overflow-visible" 
                          style={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontSize: `${config.pinyinSize}px`, 
                            height: '1.2em', 
                            marginBottom: '6px',
                            minWidth: `${config.gridSize}px`,
                            opacity: config.showPinyin ? 1 : 0
                          }}
                        >
                          {item.pinyin}
                        </div>
                        
                        {/* 格子单元：必须是绝对的正方形 */}
                        <div 
                          className="relative box-border bg-white overflow-visible" 
                          style={{ 
                            width: `${config.gridSize}px`, 
                            height: `${config.gridSize}px`,
                            border: `1.5px solid ${config.gridColor}`
                          }}
                        >
                          {/* 内部网格线：使用绝对定位确保中心点固定 */}
                          <div className="absolute inset-0 pointer-events-none opacity-50 overflow-hidden">
                            {config.gridType !== GridType.EMPTY && (
                              <>
                                {/* 水平居中线 */}
                                <div 
                                  className="absolute top-1/2 left-0 w-full" 
                                  style={{ 
                                    borderTop: `1px ${config.lineStyle} ${config.gridColor}`,
                                    transform: 'translateY(-50%)'
                                  }}
                                ></div>
                                {/* 垂直居中线 */}
                                <div 
                                  className="absolute left-1/2 top-0 h-full" 
                                  style={{ 
                                    borderLeft: `1px ${config.lineStyle} ${config.gridColor}`,
                                    transform: 'translateX(-50%)'
                                  }}
                                ></div>
                              </>
                            )}
                            {config.gridType === GridType.MI && (
                              <svg className="absolute inset-0 w-full h-full">
                                <line 
                                  x1="0" y1="0" x2="100%" y2="100%" 
                                  stroke={config.gridColor} 
                                  strokeWidth="1" 
                                  strokeDasharray={config.lineStyle === 'dashed' ? '4 4' : '0'} 
                                />
                                <line 
                                  x1="100%" y1="0" x2="0" y2="100%" 
                                  stroke={config.gridColor} 
                                  strokeWidth="1" 
                                  strokeDasharray={config.lineStyle === 'dashed' ? '4 4' : '0'} 
                                />
                              </svg>
                            )}
                          </div>

                          {/* 汉字：严格绝对居中对齐 */}
                          {item.showChar && (
                            <div 
                              className="copybook-font absolute z-10 select-none text-center flex items-center justify-center overflow-visible"
                              style={{ 
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '100%',
                                height: '100%',
                                fontSize: `${config.charSize}px`, 
                                color: config.shadowColor,
                                lineHeight: 1
                              }}
                            >
                              {item.char}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* 页面页脚 */}
          <div className="absolute bottom-8 left-0 w-full flex items-center justify-center pointer-events-none">
             <div className="px-6 py-1 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase">
                沫渣特 • 第 {idx + 1} 页，共 {pages.length} 页
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviewArea;
