import test from "node:test";
import assert from "node:assert/strict";
import { siteLink, SITE_URL } from "./siteUrl.js";

test("defaults to the live domain, not a Vercel preview", () => {
  assert.equal(SITE_URL.includes("vercel.app"), false);
  assert.match(SITE_URL, /^https:\/\//);
});

test("joins a path without doubling or dropping the slash", () => {
  assert.equal(siteLink("dashboard"), `${SITE_URL}/dashboard`);
  assert.equal(siteLink("/dashboard"), `${SITE_URL}/dashboard`);
});

test("an empty path returns the site root with a single trailing slash", () => {
  assert.equal(siteLink(), `${SITE_URL}/`);
});
