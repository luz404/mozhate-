
// We will use the pinyin-pro library from CDN dynamically to avoid complex bundling
// but we wrap it in a service for clean usage.

export const getPinyinArray = async (text: string): Promise<string[]> => {
  if (!(window as any).pinyinPro) {
    await loadPinyinPro();
  }
  const pinyinPro = (window as any).pinyinPro;
  return pinyinPro.pinyin(text, { type: 'array' });
};

const loadPinyinPro = () => {
  return new Promise((resolve) => {
    if ((window as any).pinyinPro) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = "https://unpkg.com/pinyin-pro@3.18.3/dist/index.js";
    script.onload = () => resolve(true);
    document.head.appendChild(script);
  });
};
