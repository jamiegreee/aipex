import assert from "node:assert/strict";
import test from "node:test";
import { parseProfileName } from "../src/lib/account-profile";

test("profile names preserve international spelling and normalize combining marks", () => {
  for (const name of ["Zoë Nguyễn", "山田 太郎", "عائشة حسن", "श्रेया कुमार", "A\u0301ine Ó Briain", "O’Connor-Smith"])
    assert.deepEqual(parseProfileName(`  ${name}  `), { name: name.normalize("NFC") });
});

test("profile name limits count Unicode characters rather than UTF-16 code units", () => {
  assert.deepEqual(parseProfileName("A"), { name: "A" });
  const name = "\u{10400}".repeat(80);
  assert.deepEqual(parseProfileName(name), { name });
  assert.ok("error" in parseProfileName(`${name}A`));
});

test("profile names reject missing, non-text and invisible-only values", () => {
  for (const value of [null, undefined, 12, new Blob(["not a name"]), "", "  ", "\u200b", "\u3164"])
    assert.ok("error" in parseProfileName(value));
});

test("profile names cannot contain hidden direction changes, control characters or extra lines", () => {
  for (const name of ["Jamie\nGreen", "Jamie\tGreen", "Jamie\u0000Green", "Jamie\u202eGreen", "Jamie\u200bGreen", "Jamie\u2028Green", "Jamie\ufe0fGreen", "Jamie\ud800Green"])
    assert.ok("error" in parseProfileName(name), JSON.stringify(name));
});
