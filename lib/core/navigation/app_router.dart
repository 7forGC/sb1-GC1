import 'package:flutter/material.dart';
import 'package:cz_flow/features/home/presentation/pages/home_page.dart';
import 'package:cz_flow/features/auth/presentation/pages/auth_page.dart';
import 'package:cz_flow/features/search/presentation/pages/search_page.dart';
import 'package:cz_flow/features/create/presentation/pages/create_page.dart';
import 'package:cz_flow/features/activity/presentation/pages/activity_page.dart';
import 'package:cz_flow/features/profile/presentation/pages/profile_page.dart';
import 'package:cz_flow/features/messages/presentation/pages/messages_page.dart';

class AppRouter {
  static const String home = '/';
  static const String auth = '/auth';
  static const String search = '/search';
  static const String create = '/create';
  static const String activity = '/activity';
  static const String profile = '/profile';
  static const String messages = '/messages';

  static Route<dynamic> generateRoute(RouteSettings settings) {
    switch (settings.name) {
      case home:
        return MaterialPageRoute(builder: (_) => const HomePage());
      case auth:
        return MaterialPageRoute(builder: (_) => const AuthPage());
      case search:
        return MaterialPageRoute(builder: (_) => const SearchPage());
      case create:
        return MaterialPageRoute(builder: (_) => const CreatePage());
      case activity:
        return MaterialPageRoute(builder: (_) => const ActivityPage());
      case profile:
        return MaterialPageRoute(builder: (_) => const ProfilePage());
      case messages:
        return MaterialPageRoute(builder: (_) => const MessagesPage());
      default:
        return MaterialPageRoute(
          builder: (_) => Scaffold(
            body: Center(
              child: Text('No route defined for ${settings.name}'),
            ),
          ),
        );
    }
  }
}

class NavigationService {
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  Future<dynamic> navigateTo(String routeName) {
    return navigatorKey.currentState!.pushNamed(routeName);
  }

  Future<dynamic> navigateToWithArguments(String routeName, Object arguments) {
    return navigatorKey.currentState!.pushNamed(routeName, arguments: arguments);
  }

  void goBack() {
    return navigatorKey.currentState!.pop();
  }

  Future<dynamic> navigateToAndRemoveUntil(String routeName) {
    return navigatorKey.currentState!.pushNamedAndRemoveUntil(
      routeName,
      (Route<dynamic> route) => false,
    );
  }

  Future<dynamic> pushReplacementNamed(String routeName) {
    return navigatorKey.currentState!.pushReplacementNamed(routeName);
  }
}