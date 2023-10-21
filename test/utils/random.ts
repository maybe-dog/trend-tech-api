// テスト用にランダムな値を作成する関数群

export const generateRandomString = (charCount = 7): string => {
  const str = Math.random().toString(36).substring(2).slice(-charCount);
  return str.length < charCount
    ? str + 'a'.repeat(charCount - str.length)
    : str;
};

export const generateRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min);
};
