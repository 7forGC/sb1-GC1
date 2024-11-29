import 'package:flutter/material.dart';
import 'package:iconsax_flutter/iconsax_flutter.dart';
import 'package:cz_flow/features/home/presentation/widgets/story_list.dart';
import 'package:cz_flow/features/home/presentation/widgets/post_list.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Chatify'),
        actions: [
          IconButton(
            icon: const Icon(Iconsax.message),
            onPressed: () {},
          ),
        ],
      ),
      body: const CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: StoryList(),
          ),
          SliverFillRemaining(
            child: PostList(),
          ),
        ],
      ),
      bottomNavigationBar: NavigationBar(
        destinations: const [
          NavigationDestination(
            icon: Icon(Iconsax.home),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Iconsax.search_normal),
            label: 'Search',
          ),
          NavigationDestination(
            icon: Icon(Iconsax.add_square),
            label: 'Create',
          ),
          NavigationDestination(
            icon: Icon(Iconsax.heart),
            label: 'Activity',
          ),
          NavigationDestination(
            icon: Icon(Iconsax.profile_circle),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}