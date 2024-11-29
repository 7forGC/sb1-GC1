import { makeAutoObservable, runInAction } from 'mobx';
import { supabase } from '../../../lib/supabase';
import type { User, LoginCredentials, RegisterCredentials } from '../types';

export class AuthStore {
  user: User | null = null;
  isLoading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initializeAuth();
  }

  private async initializeAuth() {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await this.setUser(session.user);
      }

      supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await this.setUser(session.user);
        } else if (event === 'SIGNED_OUT') {
          runInAction(() => {
            this.user = null;
          });
        }
      });
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  get isAuthenticated() {
    return !!this.user;
  }

  async login({ email, password }: LoginCredentials) {
    try {
      this.isLoading = true;
      this.error = null;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        await this.setUser(data.user);
      }
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to sign in';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async register({ email, password, username }: RegisterCredentials) {
    try {
      this.isLoading = true;
      this.error = null;

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (error) throw error;
      if (data.user) {
        await this.setUser(data.user);
      }
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to create account';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  private async setUser(authUser: any) {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error) throw error;

      runInAction(() => {
        this.user = {
          id: authUser.id,
          email: authUser.email!,
          username: profile.username,
          avatar: profile.avatar_url,
          createdAt: new Date(authUser.created_at),
        };
      });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  async logout() {
    try {
      this.isLoading = true;
      this.error = null;

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      runInAction(() => {
        this.user = null;
      });
    } catch (error: any) {
      runInAction(() => {
        this.error = error.message || 'Failed to sign out';
      });
      throw error;
    } finally {
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }
}

export const authStore = new AuthStore();