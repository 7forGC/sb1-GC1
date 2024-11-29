export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  imageUrl: string;
  caption: string;
  createdAt: Date;
  likes: number;
  comments: number;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaUrl: string;
  createdAt: Date;
  isViewed: boolean;
}