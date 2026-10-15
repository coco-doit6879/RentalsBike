import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { chmodSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { emitKeypressEvents } from "node:readline";
import { fileURLToPath } from "node:url";

/** Save only a slow password hash, never the supplied password. */
export function savePassword(password, file = resolve(process.cwd(), ".env.local")) {
  if (typeof password !== "string" || password.length < 12 || password.length > 1024) throw new Error("Use a password between 12 and 1024 characters.");
  const salt = randomBytes(16).toString("hex");
  const hash = `scrypt$16384$8$1$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
  let previous = "";
  try { previous = readFileSync(file, "utf8"); }
  catch (error) { if (error.code !== "ENOENT") throw error; }
  // dotenv-expand processes dollars even inside quotes; escape each delimiter.
  const line = `ADMIN_PASSWORD_HASH="${hash.replaceAll("$", "\\$")}"`;
  const lines = previous.split(/\r?\n/).filter((entry) => !/^\s*(?:export\s+)?ADMIN_PASSWORD_HASH\s*=/.test(entry));
  while (lines.at(-1) === "") lines.pop();
  const contents = `${lines.join("\n")}${lines.length ? "\n" : ""}${line}\n`;
  const temporary = `${file}.${randomBytes(8).toString("hex")}.tmp`;
  try {
    writeFileSync(temporary, contents, { mode: 0o600, flag: "wx" });
    try { chmodSync(temporary, 0o600); } catch { /* Use Windows filesystem ACLs. */ }
    renameSync(temporary, file);
    try { chmodSync(file, 0o600); } catch { /* Use Windows filesystem ACLs. */ }
  } finally { rmSync(temporary, { force: true }); }
}

export function readMasked(prompt) {
  if (!process.stdin.isTTY || !process.stdout.isTTY || typeof process.stdin.setRawMode !== "function") {
    return Promise.reject(new Error("Run admin setup in an interactive terminal. Passwords are not accepted from pipes or arguments."));
  }
  return new Promise((resolvePassword, reject) => {
    const characters = [];
    const wasRaw = process.stdin.isRaw;
    emitKeypressEvents(process.stdin);
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    function finish(error) {
      process.stdin.off("keypress", onKey);
      process.stdin.setRawMode(wasRaw ?? false);
      process.stdin.pause();
      process.stdout.write("\n");
      if (error) reject(error); else resolvePassword(characters.join(""));
    }
    function onKey(text, key = {}) {
      if (key.ctrl && key.name === "c") return finish(new Error("Setup cancelled."));
      if (key.name === "return" || key.name === "enter") return finish();
      if (key.name === "backspace") {
        if (characters.length) { characters.pop(); process.stdout.write("\b \b"); }
        return;
      }
      if (key.ctrl || key.meta || !text) return;
      for (const character of text) {
        if (/[\x00-\x1f\x7f]/.test(character)) continue;
        if (characters.join("").length + character.length > 1024) continue;
        characters.push(character);
        process.stdout.write("*");
      }
    }
    process.stdin.on("keypress", onKey);
  });
}
async function main() {
  if (process.argv.length > 2) throw new Error("Do not pass passwords as arguments. Run admin setup in an interactive terminal.");
  const password = await readMasked("New admin password (at least 12 characters): ");
  const confirmation = await readMasked("Confirm password: ");
  const first = Buffer.from(password);
  const second = Buffer.from(confirmation);
  if (first.length !== second.length || !timingSafeEqual(first, second)) throw new Error("Passwords do not match; no changes made.");
  savePassword(password);
  first.fill(0); second.fill(0);
  process.stdout.write("Admin password hash saved to .env.local. Restart the Next.js server to apply it. Existing sessions are revoked after restart.\n");
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => { process.stderr.write(`${error.message}\n`); process.exitCode = 1; });
}
