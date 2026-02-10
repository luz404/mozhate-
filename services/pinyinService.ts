
// 使用 pinyin-pro 库，确保符合汉语拼音方案 (GB/T 16159-2012)
export const getPinyinArray = async (text: string): Promise<string[]> => {
  if (!(window as any).pinyinPro) {
    await loadPinyinPro();
  }
  const { pinyin } = (window as any).pinyinPro;
  
  // 逐字生成拼音是解决 Pinyin 库映射或截断问题的最稳妥方案
  // 将文本转为数组，确保每个汉字独立获取完整的带音调拼音
  return Array.from(text).map(char => {
    const result = pinyin(char, { 
      toneType: 'symbol', 
      v: true 
    });
    // pinyin-pro 逐字模式下返回的是字符串，确保取到的是该字的完整读音
    return result.trim();
  });
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
