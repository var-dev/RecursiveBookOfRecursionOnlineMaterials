import { describe, it } from "node:test";
import * as assert from "node:assert/strict";

import { hey } from "../src/index";

describe("Sample Test Suite", () => {
  it("should pass this sample test", () => {
    assert.strictEqual(hey(), "Hello, World");
  })
})