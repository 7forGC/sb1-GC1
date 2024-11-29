import 'package:flutter/material.dart';
import 'package:iconsax_flutter/iconsax_flutter.dart';
import 'package:cz_flow/core/navigation/app_router.dart';

class BottomNavigation extends StatelessWidget {
  final int currentIndex;
  final Function(int) onTap;

  const BottomNavigation({
    super.key,
    required this.currentIndex,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return NavigationBar(
      selectedIndex: currentIndex,
      onDestinationSelected: onTap,
      destinations: const [
        NavigationDestination(
          icon: Icon(Iconsax.home),
          selectedIcon: Icon(Iconsax.home_15),
          label: 'Home',
        ),
        NavigationDestination(
          icon: Icon(Iconsax.search_normal),
          selectedIcon: Icon(Iconsax.search_normal_1),
          label: 'Search',
        ),
        NavigationDestination(
          icon: Icon(Iconsax.add_square),
          selectedIcon: Icon(Iconsax.add_square5),
          label: 'Create',
        ),
        NavigationDestination(
          icon: Icon(Iconsax.heart),
          selectedIcon: Icon(Iconsax.heart5),
          label: 'Activity',
        ),
        NavigationDestination(
          icon: Icon(Iconsax.profile_circle),
          selectedIcon: Icon(Iconsax.profile_circle5),
          label: 'Profile',
        ),
      ],
    );
  }
}