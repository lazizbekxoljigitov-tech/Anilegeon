export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar_url?: string;
  bio?: string;
  gender?: string;
  country?: string;
  dob?: string;
  is_deleted?: boolean;
  deleted_at?: string;
  created_at: string;
}

export interface UserPreferences {
  user_id: string;
  genres: string[];
  language: string;
  autoplay: boolean;
  quality: string;
  mature_content: boolean;
}

export interface UserPrivacy {
  user_id: string;
  visibility: 'public' | 'friends' | 'private';
  show_status: boolean;
  allow_requests: boolean;
}

export interface UserNotifications {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  episode_alerts: boolean;
  comment_replies: boolean;
  friend_requests: boolean;
}

export interface Anime {
  id: string;
  title: string;
  description?: string;
  banner_url?: string;
  thumbnail_url?: string;
  rating: number;
  is_trending: boolean;
  is_featured: boolean;
  view_count: number;
  status: 'ongoing' | 'completed';
  created_at: string;
  categories?: Category[];
  episodes?: Episode[];
}

export interface Episode {
  id: string;
  anime_id: string;
  title?: string;
  episode_number: number;
  video_url?: string;
  duration: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export interface AnimeCategory {
  anime_id: string;
  category_id: string;
}

export interface View {
  id: string;
  user_id?: string;
  anime_id: string;
  episode_id?: string;
  watched_at: string;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  anime_id: string;
  episode_id?: string;
  progress: number;
  updated_at: string;
}

export interface SavedAnime {
  id: string;
  user_id: string;
  anime_id: string;
  created_at: string;
}

export interface AuthPayload {
  id: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}
