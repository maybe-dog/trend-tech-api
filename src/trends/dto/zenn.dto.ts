export class ZennTrendsResponse {
  articles: Article[];
  total_count: number;
}
export class Article {
  id: number;
  post_type: 'Article';
  title: string;
  slug: string;
  published: boolean;
  comments_count: number;
  liked_count: number;
  body_letters_count: number;
  article_type: 'tech' | 'idea';
  emoji: string;
  is_suspending_private: boolean;
  published_at: string;
  body_updated_at: string;
  source_repo_updated_at: string;
  path: string;
  user: User;
  publication: Publication | null;
}
class User {
  id: number;
  username: string;
  name: string;
  avatar_small_url: string;
}
class Publication {
  id: number;
  name: string;
  avatar_small_url: string;
  display_name: string;
  beta_stats: boolean;
  avatar_registered: boolean;
}
export class ZennArticleResponse {
  articles: Article[];
  next_page: number | null;
}
