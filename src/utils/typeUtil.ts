/**
 * 型付きのnot NULLチェック関数
 * @param item
 * @returns
 */
export function notNull<T>(item: T | null): item is T {
  return item !== null;
}
