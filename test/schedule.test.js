import assert from "node:assert/strict";
import test from "node:test";
import {
  dateInIstanbul,
  millisecondsUntilPostTime,
  shouldSkipEarlyScheduledRun,
} from "../src/schedule.js";

test("İstanbul takvim gününü doğru hesaplar", () => {
  assert.equal(dateInIstanbul(new Date("2026-08-25T21:30:00Z")), "2026-08-26");
});

test("20.40'ta 21.00 için yirmi dakika bekler", () => {
  assert.equal(
    millisecondsUntilPostTime(new Date("2026-08-25T17:40:00Z")),
    20 * 60 * 1000,
  );
});

test("21.00 geçince beklemez", () => {
  assert.equal(millisecondsUntilPostTime(new Date("2026-08-25T18:05:00Z")), 0);
});

test("20.50 tetikleyicisi 21.00'a kadar bekleyebilir", () => {
  assert.equal(shouldSkipEarlyScheduledRun(new Date("2026-08-25T17:50:00Z")), false);
});

test("gece yarısından sonra gecikmiş iş ertesi günün sözünü atmaz", () => {
  assert.equal(shouldSkipEarlyScheduledRun(new Date("2026-08-25T21:05:00Z")), true);
});
