import 'package:mobx/mobx.dart';
import 'package:cz_flow/features/posts/models/post.dart';
import 'package:cz_flow/features/posts/repositories/post_repository.dart';

part 'post_store.g.dart';

class PostStore = _PostStore with _$PostStore;

abstract class _PostStore with Store {
  final PostRepository _postRepository;

  _PostStore(this._postRepository);

  @observable
  ObservableList<Post> posts = ObservableList<Post>();

  @observable
  bool isLoading = false;

  @observable
  String? error;

  @observable
  bool hasMorePosts = true;

  @observable
  int currentPage = 1;

  @computed
  bool get canLoadMore => hasMorePosts && !isLoading;

  @action
  Future<void> loadPosts({bool refresh = false}) async {
    if (refresh) {
      currentPage = 1;
      hasMorePosts = true;
    }

    if (!hasMorePosts || isLoading) return;

    try {
      isLoading = true;
      error = null;

      final newPosts = await _postRepository.getPosts(page: currentPage);
      
      if (refresh) {
        posts.clear();
      }

      if (newPosts.isEmpty) {
        hasMorePosts = false;
      } else {
        posts.addAll(newPosts);
        currentPage++;
      }
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> createPost(String caption, String mediaPath) async {
    try {
      isLoading = true;
      error = null;
      
      final newPost = await _postRepository.createPost(caption, mediaPath);
      posts.insert(0, newPost);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> likePost(String postId) async {
    try {
      final post = posts.firstWhere((p) => p.id == postId);
      final index = posts.indexOf(post);
      
      if (post.isLiked) {
        await _postRepository.unlikePost(postId);
        posts[index] = post.copyWith(
          isLiked: false,
          likesCount: post.likesCount - 1,
        );
      } else {
        await _postRepository.likePost(postId);
        posts[index] = post.copyWith(
          isLiked: true,
          likesCount: post.likesCount + 1,
        );
      }
    } catch (e) {
      error = e.toString();
    }
  }

  @action
  Future<void> deletePost(String postId) async {
    try {
      await _postRepository.deletePost(postId);
      posts.removeWhere((post) => post.id == postId);
    } catch (e) {
      error = e.toString();
    }
  }
}