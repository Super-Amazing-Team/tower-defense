export async function checkOnLine() {
  const URL = "https://super-amazing-team-tower-defense-22.ru/";
  try {
    await fetch(URL, {
      method: "HEAD",
      mode: "no-cors",
      headers: [["Cache-Control", "no-cache"]],
    });
    return true;
  } catch {
    return false;
  }
}
