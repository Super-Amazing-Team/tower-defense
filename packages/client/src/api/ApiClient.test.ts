import type { AxiosError } from "axios";
import { ApiClient } from "./ApiClient";

describe("ApiClient", () => {
  test("should return data signUp", async () => {
    const body = {
      email: "test",
      first_name: "test",
      login: "test",
      password: "12345678",
      phone: "77777777777",
      second_name: "test",
    };
    let err;
    try {
      await ApiClient.signUp(body);
    } catch (error) {
      const { response } = error as AxiosError<{ reason: string }>;
      if (response?.data.reason) {
        err = response.data.reason;
      }
    } finally {
      expect(err).toEqual("email is not valid");
    }
  });

  test("should return data signIn", async () => {
    const body = {
      login: "login",
      password: "password",
    };
    let err;
    try {
      await ApiClient.signIn(body);
    } catch (error) {
      const { response } = error as AxiosError<{ reason: string }>;
      if (response?.data) {
        err = response.data;
      }
    } finally {
      expect(err).toEqual("Internal Server Error");
    }
  });

  test("should return data getAllLeaderboard", async () => {
    const body = {
      ratingFieldName: "rating",
      cursor: 0,
      limit: 10,
    };
    let err;
    try {
      await ApiClient.getAllLeaderboard(body);
    } catch (error) {
      const { response } = error as AxiosError<{ reason: string }>;
      if (response?.data.reason) {
        err = response.data.reason;
      }
    } finally {
      expect(err).toEqual("Cookie is not valid");
    }
  });
});
