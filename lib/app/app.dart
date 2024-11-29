import 'package:flutter/material.dart';
import 'package:cz_flow/app/theme/app_theme.dart';
import 'package:cz_flow/features/home/presentation/pages/home_page.dart';
import 'package:cz_flow/core/database/database_helper.dart';

class CzFlowApp extends StatefulWidget {
  const CzFlowApp({super.key});

  @override
  State<CzFlowApp> createState() => _CzFlowAppState();
}

class _CzFlowAppState extends State<CzFlowApp> {
  final DatabaseHelper _databaseHelper = DatabaseHelper();
  bool _isInitialized = false;

  @override
  void initState() {
    super.initState();
    _initializeApp();
  }

  Future<void> _initializeApp() async {
    try {
      // Initialize the database
      await _databaseHelper.database;
      setState(() {
        _isInitialized = true;
      });
    } catch (e) {
      debugPrint('Failed to initialize database: $e');
      // Handle initialization error (show error screen, retry, etc.)
    }
  }

  @override
  Widget build(BuildContext context) {
    if (!_isInitialized) {
      return MaterialApp(
        home: Scaffold(
          body: Center(
            child: CircularProgressIndicator(),
          ),
        ),
      );
    }

    return MaterialApp(
      title: 'Chatify',
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      home: const HomePage(),
      debugShowCheckedModeBanner: false,
    );
  }

  @override
  void dispose() {
    _databaseHelper.close();
    super.dispose();
  }
}