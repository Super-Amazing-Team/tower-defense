import APIService from "./baseService";

const getAllLeaderboard = (body: {
  ratingFieldName: string;
  cursor: number;
  limit: number;
}) => APIService.post("/leaderboard/all", body);

const getUserInfo = () => APIService.get("/auth/user");

const logout = () => APIService.post("/auth/logout");

const signIn = (body: { login: string; password: string }) =>
  APIService.post("/auth/signin", body);

const signUp = (body: {
  first_name: string;
  second_name: string;
  login: string;
  email: string;
  password: string;
  phone: string;
}) => APIService.post("/auth/signup", body);

const changeUserProfile = (body: {
  first_name: string;
  second_name: string;
  display_name: string;
  login: string;
  email: string;
  phone: string;
}) => APIService.put("/user/profile", body);

const changeUserPassword = (body: {
  oldPassword: string;
  newPassword: string;
}) => APIService.put("/user/password", body);

export {
  getAllLeaderboard,
  signUp,
  getUserInfo,
  logout,
  signIn,
  changeUserProfile,
  changeUserPassword,
};
