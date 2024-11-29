void main() {
  runApp(
    MaterialApp(
      navigatorKey: NavigationService().navigatorKey,
      onGenerateRoute: AppRouter.generateRoute,
      initialRoute: AppRouter.home,
    ),
  );
}
