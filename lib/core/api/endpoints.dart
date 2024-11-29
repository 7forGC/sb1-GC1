class Endpoints {
  // Auth endpoints
  static const String login = '/auth/login';
  static const String register = '/auth/register';
  static const String logout = '/auth/logout';
  static const String refreshToken = '/auth/refresh';
  static const String me = '/auth/me';

  // User endpoints
  static const String users = '/users';
  static const String userProfile = '/users/profile';
  static const String updateProfile = '/users/profile';
  static const String changePassword = '/users/password';

  // Posts endpoints
  static const String posts = '/posts';
  static const String postLikes = '/posts/{id}/likes';
  static const String postComments = '/posts/{id}/comments';
  static const String postBookmarks = '/posts/{id}/bookmarks';

  // Stories endpoints
  static const String stories = '/stories';
  static const String storyViews = '/stories/{id}/views';

  // Chat endpoints
  static const String conversations = '/conversations';
  static const String messages = '/conversations/{id}/messages';
  static const String readMessages = '/conversations/{id}/read';

  // Notifications endpoints
  static const String notifications = '/notifications';
  static const String markNotificationsRead = '/notifications/read';

  // Search endpoints
  static const String search = '/search';
  static const String searchUsers = '/search/users';
  static const String searchPosts = '/search/posts';
  static const String searchTags = '/search/tags';

  static String withId(String endpoint, String id) {
    return endpoint.replaceAll('{id}', id);
  }
}