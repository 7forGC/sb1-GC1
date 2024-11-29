import 'package:flutter/material.dart';
import 'package:iconsax_flutter/iconsax_flutter.dart';
import 'package:cached_network_image/cached_network_image.dart';

class PostList extends StatelessWidget {
  const PostList({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: EdgeInsets.zero,
      itemCount: 5,
      itemBuilder: (context, index) {
        return Card(
          margin: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ListTile(
                leading: CircleAvatar(
                  backgroundImage: CachedNetworkImageProvider(
                    'https://source.unsplash.com/random/50x50?face=$index',
                  ),
                ),
                title: Text('User $index'),
                subtitle: const Text('2 hours ago'),
                trailing: IconButton(
                  icon: const Icon(Iconsax.more),
                  onPressed: () {},
                ),
              ),
              CachedNetworkImage(
                imageUrl: 'https://source.unsplash.com/random/400x400?nature=$index',
                fit: BoxFit.cover,
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        IconButton(
                          icon: const Icon(Iconsax.heart),
                          onPressed: () {},
                        ),
                        IconButton(
                          icon: const Icon(Iconsax.message),
                          onPressed: () {},
                        ),
                        IconButton(
                          icon: const Icon(Iconsax.send_2),
                          onPressed: () {},
                        ),
                        const Spacer(),
                        IconButton(
                          icon: const Icon(Iconsax.bookmark),
                          onPressed: () {},
                        ),
                      ],
                    ),
                    const Text(
                      '1,234 likes',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    RichText(
                      text: TextSpan(
                        style: DefaultTextStyle.of(context).style,
                        children: [
                          TextSpan(
                            text: 'User $index ',
                            style: const TextStyle(fontWeight: FontWeight.bold),
                          ),
                          const TextSpan(
                            text: 'Beautiful nature captured in its purest form. #nature #photography',
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}