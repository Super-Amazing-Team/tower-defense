import type { AxiosError } from "axios";
import { ApiClient } from "./ApiClient";
import type { TNullable } from "@/utils";

const { signUp, signIn, getAllLeaderboard, changeUserProfile } = ApiClient;

const MOCK = {
  valid: {
    leaderboard: {
      ratingFieldName: "rating",
      cursor: 0,
      limit: 10,
    },
    register: {
      first_name: "string",
      second_name: "string",
      login: `string${Math.round(Math.random() * 10_000)}`,
      email: `string${Math.round(Math.random() * 10_000)}@asd.asd`,
      password: "stringString123",
      phone: "0123456789",
    },
    get updateProfile() {
      return { ...this.register, display_name: this.register.first_name };
    },
  },
  invalid: {
    login: {
      login: "login",
      password: "password",
    },
    register: {
      email: "test",
      first_name: "test",
      login: "test",
      password: "12345678",
      phone: "77777777777",
      second_name: "test",
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cache: {} as Record<string, any>,
};

describe("ApiClient", () => {
  test("should not register with invalid email", async () => {
    let err;
    try {
      await signUp(MOCK.invalid.register);
    } catch (error) {
      const { response } = error as AxiosError<{ reason: string }>;
      if (response?.data.reason) {
        err = response.data.reason;
      }
    } finally {
      expect(err).toEqual("email is not valid");
    }
  });

  test("should throw internal server error", async () => {
    let err;
    try {
      await signIn(MOCK.invalid.login);
    } catch (error) {
      const { response } = error as AxiosError<{ reason: string }>;
      if (response?.data) {
        err = response.data;
      }
    } finally {
      expect(err).toEqual("Internal Server Error");
    }
  });

  test("should reject without cookie", async () => {
    let err;
    try {
      await getAllLeaderboard(MOCK.valid.leaderboard);
    } catch (error) {
      const { response } = error as AxiosError<{ reason: string }>;
      if (response?.data.reason) {
        err = response.data.reason;
      }
    } finally {
      expect(err).toEqual("Cookie is not valid");
    }
  });

  describe("Work with registered user", () => {
    test("should register random user", async () => {
      type TMock = TNullable<Awaited<ReturnType<typeof signUp>>>;
      const mockUser = MOCK.valid.register;
      let attempts = 3;
      let result: TMock = null;
      async function attempt() {
        try {
          if (!attempts) return;
          result = await signUp(mockUser);
        } catch {
          attempts--;
          attempt();
        }
      }
      await attempt();
      if (result && typeof result === "object" && "id" in result) {
        MOCK.cache.user = {
          login: mockUser.login,
          password: mockUser.password,
        };
      }

      expect(typeof (result as TMock)?.id).toBe("number");
    });

    test("should change profile", async () => {
      let res;
      try {
        res = await changeUserProfile(MOCK.valid.updateProfile);
      } catch (err) {
        res = false;
      }
      expect(res).toBeTruthy();
    });
  });
});
