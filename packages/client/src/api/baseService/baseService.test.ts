import APIService from ".";

describe("APIService", () => {
  test("should return data", async () => {
    const data = await APIService.get("/oauth/yandex/service-id");
    expect(data).toBeTruthy();
  });
});
