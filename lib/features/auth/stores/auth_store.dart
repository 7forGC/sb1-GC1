import 'package:mobx/mobx.dart';
import 'package:cz_flow/features/auth/models/user.dart';
import 'package:cz_flow/features/auth/repositories/auth_repository.dart';

part 'auth_store.g.dart';

class AuthStore = _AuthStore with _$AuthStore;

abstract class _AuthStore with Store {
  final AuthRepository _authRepository;

  _AuthStore(this._authRepository);

  @observable
  User? currentUser;

  @observable
  bool isLoading = false;

  @observable
  String? error;

  @computed
  bool get isAuthenticated => currentUser != null;

  @action
  Future<void> login(String email, String password) async {
    try {
      isLoading = true;
      error = null;
      currentUser = await _authRepository.login(email, password);
    } catch (e) {
      error = e.toString();
      currentUser = null;
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> register(String email, String password, String username) async {
    try {
      isLoading = true;
      error = null;
      currentUser = await _authRepository.register(email, password, username);
    } catch (e) {
      error = e.toString();
      currentUser = null;
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> logout() async {
    try {
      isLoading = true;
      error = null;
      await _authRepository.logout();
      currentUser = null;
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> checkAuthState() async {
    try {
      isLoading = true;
      error = null;
      currentUser = await _authRepository.getCurrentUser();
    } catch (e) {
      error = e.toString();
      currentUser = null;
    } finally {
      isLoading = false;
    }
  }
}