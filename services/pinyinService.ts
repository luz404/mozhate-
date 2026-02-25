
// 使用 pinyin-pro 库，确保符合汉语拼音方案 (GB/T 16159-2012)
export const getPinyinArray = async (text: string): Promise<string[]> => {
  if (!(window as any).pinyinPro) {
    await loadPinyinPro();
  }
  const { pinyin } = (window as any).pinyinPro;
  
  // 直接传入整个文本，pinyin-pro 会根据上下文处理多音字
  // type: 'array' 确保返回一个与输入字符一一对应的拼音数组
  const result = pinyin(text, { 
    toneType: 'symbol', 
    type: 'array',
    v: true 
  });
  
  return result;
};

const loadPinyinPro = () => {
  return new Promise((resolve) => {
    if ((window as any).pinyinPro) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    // 使用 jsdelivr 提供的稳定版本
    script.src = "https://cdn.jsdelivr.net/npm/pinyin-pro@3.26.0/dist/index.js";
    script.onload = () => resolve(true);
    document.head.appendChild(script);
  });
};
