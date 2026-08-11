import api from "./api";

export default {
  login(username, password) {
    return api.post("/auth/login", { username, password });
  },
  logout() {
    return api.post("/auth/logout");
  },
  refresh() {
    return api.post("/auth/refresh");
  },
  me() {
    return api.get("/auth/me");
  },
};
