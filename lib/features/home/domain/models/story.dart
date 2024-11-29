class Story {
  final String id;
  final String userId;
  final String username;
  final String userAvatar;
  final String mediaUrl;
  final DateTime createdAt;
  final bool isViewed;

  Story({
    required this.id,
    required this.userId,
    required this.username,
    required this.userAvatar,
    required this.mediaUrl,
    required this.createdAt,
    required this.isViewed,
  });
}