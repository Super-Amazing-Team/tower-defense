export async function checkOnLine() {
  const URL = "http://www.google.com/";
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
