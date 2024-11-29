import 'package:mobx/mobx.dart';
import 'package:cz_flow/features/messages/models/message.dart';
import 'package:cz_flow/features/messages/models/conversation.dart';
import 'package:cz_flow/features/messages/repositories/message_repository.dart';

part 'message_store.g.dart';

class MessageStore = _MessageStore with _$MessageStore;

abstract class _MessageStore with Store {
  final MessageRepository _messageRepository;

  _MessageStore(this._messageRepository);

  @observable
  ObservableList<Conversation> conversations = ObservableList<Conversation>();

  @observable
  ObservableMap<String, ObservableList<Message>> messages = ObservableMap<String, ObservableList<Message>>();

  @observable
  bool isLoading = false;

  @observable
  String? error;

  @observable
  String? currentConversationId;

  @computed
  ObservableList<Message>? get currentMessages => 
    currentConversationId != null ? messages[currentConversationId] : null;

  @action
  Future<void> loadConversations() async {
    try {
      isLoading = true;
      error = null;
      
      final newConversations = await _messageRepository.getConversations();
      conversations.clear();
      conversations.addAll(newConversations);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> loadMessages(String conversationId) async {
    try {
      isLoading = true;
      error = null;
      currentConversationId = conversationId;

      final newMessages = await _messageRepository.getMessages(conversationId);
      messages[conversationId] = ObservableList.of(newMessages);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> sendMessage(String conversationId, String content) async {
    try {
      final message = await _messageRepository.sendMessage(conversationId, content);
      
      if (!messages.containsKey(conversationId)) {
        messages[conversationId] = ObservableList<Message>();
      }
      
      messages[conversationId]!.insert(0, message);
      
      // Update conversation last message
      final conversationIndex = conversations.indexWhere((c) => c.id == conversationId);
      if (conversationIndex != -1) {
        final conversation = conversations[conversationIndex];
        conversations[conversationIndex] = conversation.copyWith(
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
        );
      }
    } catch (e) {
      error = e.toString();
    }
  }

  @action
  void markAsRead(String conversationId) {
    try {
      _messageRepository.markAsRead(conversationId);
      
      final conversationIndex = conversations.indexWhere((c) => c.id == conversationId);
      if (conversationIndex != -1) {
        final conversation = conversations[conversationIndex];
        conversations[conversationIndex] = conversation.copyWith(unreadCount: 0);
      }
    } catch (e) {
      error = e.toString();
    }
  }
}