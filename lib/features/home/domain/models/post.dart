class Post {
  final String id;
  final String userId;
  final String username;
  final String userAvatar;
  final String imageUrl;
  final String caption;
  final DateTime createdAt;
  final int likes;
  final int comments;

  Post({
    required this.id,
    required this.userId,
    required this.username,
    required this.userAvatar,
    required this.imageUrl,
    required this.caption,
    required this.createdAt,
    required this.likes,
    required this.comments,
  });
}