/**
 * トレンド記事取得に共通のインターフェース
 */
export interface TrendsInterface {
  getTrends(): Promise<any>;
}
