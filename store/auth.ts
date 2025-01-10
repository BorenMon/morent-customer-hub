export const state = () => ({
  isAuthenticated: false,
  user: null,
});

export const mutations = {
  setAuthenticated(state, status) {
    state.isAuthenticated = status;
  },
  setUser(state, user) {
    state.user = user;
  },
  clearAuth(state) {
    state.isAuthenticated = false;
    state.user = null;
  },
};

export const actions = {
  login({ commit }, user) {
    commit('setAuthenticated', true);
    commit('setUser', user);
    localStorage.setItem('access_token', user.token); // Save token if needed
  },
  logout({ commit }) {
    commit('clearAuth');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('profile');
  },
  checkAuth({ commit }) {
    const token = localStorage.getItem('access_token');
    if (token) {
      commit('setAuthenticated', true);
      // Optionally fetch user info from the server using the token
    } else {
      commit('setAuthenticated', false);
    }
  },
};
