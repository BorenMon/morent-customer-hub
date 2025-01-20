import { defineStore } from 'pinia';

interface AuthState {
  isAuthenticated: boolean;
  user: {
    name?: string;
  } | null;
  access_token: string | null;
  refresh_token: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    user: null,
    access_token: null,
    refresh_token: null,
  }),
  actions: {
    login(user: { name?: string }, access_token: string, refresh_token: string) {
      this.isAuthenticated = true;
      this.user = user;
      this.access_token = access_token;
      this.refresh_token = refresh_token;
    },
    logout() {
      this.isAuthenticated = false;
      this.user = null;
      this.access_token = null;
      this.refresh_token = null;
    },
    checkAuth() {
      if (this.access_token && this.refresh_token) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    }
  },
  persist: true
});