import 'package:flutter/material.dart';
import 'package:cz_flow/features/auth/stores/auth_store.dart';
import 'package:cz_flow/core/navigation/app_router.dart';

class RouteGuard extends StatelessWidget {
  final Widget child;
  final AuthStore authStore;
  final bool requiresAuth;

  const RouteGuard({
    super.key,
    required this.child,
    required this.authStore,
    this.requiresAuth = true,
  });

  @override
  Widget build(BuildContext context) {
    return StreamBuilder(
      stream: authStore.authStateChanges,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        final isAuthenticated = snapshot.hasData;

        if (requiresAuth && !isAuthenticated) {
          return Navigator(
            onGenerateRoute: (settings) => MaterialPageRoute(
              builder: (_) => const AuthPage(),
              settings: const RouteSettings(name: AppRouter.auth),
            ),
          );
        }

        if (!requiresAuth && isAuthenticated) {
          return Navigator(
            onGenerateRoute: (settings) => MaterialPageRoute(
              builder: (_) => const HomePage(),
              settings: const RouteSettings(name: AppRouter.home),
            ),
          );
        }

        return child;
      },
    );
  }
}