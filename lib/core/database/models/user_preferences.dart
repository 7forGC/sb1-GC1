class UserPreferences {
  final int? id;
  final String userId;
  final String themeMode;
  final String languageCode;
  final bool notificationsEnabled;
  final bool messageNotifications;
  final bool postNotifications;
  final bool storyNotifications;
  final bool autoPlayVideos;
  final bool useMobileData;

  UserPreferences({
    this.id,
    required this.userId,
    this.themeMode = 'system',
    this.languageCode = 'en',
    this.notificationsEnabled = true,
    this.messageNotifications = true,
    this.postNotifications = true,
    this.storyNotifications = true,
    this.autoPlayVideos = true,
    this.useMobileData = true,
  });

  factory UserPreferences.fromMap(Map<String, dynamic> map) {
    return UserPreferences(
      id: map['id'] as int?,
      userId: map['user_id'] as String,
      themeMode: map['theme_mode'] as String,
      languageCode: map['language_code'] as String,
      notificationsEnabled: map['notifications_enabled'] == 1,
      messageNotifications: map['message_notifications'] == 1,
      postNotifications: map['post_notifications'] == 1,
      storyNotifications: map['story_notifications'] == 1,
      autoPlayVideos: map['auto_play_videos'] == 1,
      useMobileData: map['use_mobile_data'] == 1,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'user_id': userId,
      'theme_mode': themeMode,
      'language_code': languageCode,
      'notifications_enabled': notificationsEnabled ? 1 : 0,
      'message_notifications': messageNotifications ? 1 : 0,
      'post_notifications': postNotifications ? 1 : 0,
      'story_notifications': storyNotifications ? 1 : 0,
      'auto_play_videos': autoPlayVideos ? 1 : 0,
      'use_mobile_data': useMobileData ? 1 : 0,
    };
  }

  UserPreferences copyWith({
    int? id,
    String? userId,
    String? themeMode,
    String? languageCode,
    bool? notificationsEnabled,
    bool? messageNotifications,
    bool? postNotifications,
    bool? storyNotifications,
    bool? autoPlayVideos,
    bool? useMobileData,
  }) {
    return UserPreferences(
      id: id ?? this.id,
      userId: userId ?? this.userId,
      themeMode: themeMode ?? this.themeMode,
      languageCode: languageCode ?? this.languageCode,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      messageNotifications: messageNotifications ?? this.messageNotifications,
      postNotifications: postNotifications ?? this.postNotifications,
      storyNotifications: storyNotifications ?? this.storyNotifications,
      autoPlayVideos: autoPlayVideos ?? this.autoPlayVideos,
      useMobileData: useMobileData ?? this.useMobileData,
    );
  }
}