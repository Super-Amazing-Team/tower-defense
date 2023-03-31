export function joinUrl(...args: string[]): string {
  try {
    if (args.length === 1) {
      return new URL(args[0]).toString();
    }

    let base: string = "";
    const restUrl: string[] = [];

    for (const path of args) {
      if (path.match(/^http(s?):\/\//g)) {
        if (base.length) {
          throw new Error("Found more than one base url!");
        }
        base = path;
        continue;
      }
      restUrl.push(path);
    }

    return new URL(restUrl.join("/").replace(/\/{2,}/g, "/"), base).toString();
  } catch {
    return "";
  }
}
