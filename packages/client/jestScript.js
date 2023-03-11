import { join } from "path";
import { access } from "fs/promises";
import { promisify } from "util";
import { exec as _exec } from "child_process";

const exec = promisify(_exec);

async function detectChangedFiles() {
  try {
    const { stdout: _WORK_BRANCH } = await exec(
      "git rev-parse --abbrev-ref HEAD",
    );
    const WORK_BRANCH = _WORK_BRANCH.replace(/\n/g, " ").trim();

    const { stdout, stderr } = await exec(
      `git diff ${WORK_BRANCH} --name-only`,
    );

    if (stderr) {
      throw new Error(stderr);
    }

    return stdout.replace(/\n/g, " ");
  } catch (error) {
    console.error("[ERR]: can't detect ChangedFiles\n", error);
    return null;
  }
}

async function findRelatedTests() {
  const changedFiles = await detectChangedFiles();
  if (changedFiles === null) return null;

  const projectDir = process.cwd().replace("packages/client", "");
  const jsFilesReg = /.(j|t|cj|mj)s$/g;
  const testCases = [".spec.ts", ".test.ts"];

  const changedFilesArr = changedFiles.trim().split(" ");
  const scriptFilesArr = changedFilesArr.filter((path) =>
    path.match(jsFilesReg),
  );

  const testsArr = scriptFilesArr.reduce((res, path) => {
    const rawRes = [];
    const fullPath = join(projectDir, path);
    const fullPathArr = fullPath.split("/");

    // NOTE: check nested files
    if (fullPathArr.at(-1).replace(jsFilesReg, "") === fullPathArr.at(-2)) {
      const upperPath = fullPathArr.slice(0, -1).join("/");
      testCases.forEach((ext) => {
        rawRes.push(`${upperPath}${ext}`);
      });
    }

    testCases.forEach((ext) => {
      rawRes.push(fullPath.replace(jsFilesReg, ext));
    });

    return res.concat(rawRes);
  }, []);

  const settledRes = await Promise.allSettled(
    testsArr.map((path) => access(path).then(() => path)),
  );

  const result = settledRes
    .reduce(
      (sum, promiseRes) =>
        promiseRes.status === "fulfilled" ? `${sum} ${promiseRes.value}` : sum,
      "",
    )
    .trim();

  return result;
}

async function runRelatedTests() {
  const relatedTests = await findRelatedTests();

  if (relatedTests) {
    console.info(`Running next tests:\n${relatedTests.replace(" ", "\n")}`);
    try {
      const { stderr } = await exec(`jest --ci ${relatedTests}`);

      if (stderr) {
        console.info("[RUN TESTS]: ", stderr);
      }
    } catch (error) {
      console.error("Failed to run selected tests!\n", error);
    }
  }
}

runRelatedTests();
