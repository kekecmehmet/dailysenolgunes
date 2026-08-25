import assert from "node:assert/strict";
import Database from "better-sqlite3";
import test from "node:test";
import { getNextQuote, markAsPosted, validateQuote } from "../src/database.js";

function testDatabase() {
  const db = new Database(":memory:");
  db.exec(`CREATE TABLE quotes (
    quote TEXT PRIMARY KEY NOT NULL,
    source TEXT NOT NULL,
    posted INTEGER NOT NULL DEFAULT 0 CHECK (posted IN (0, 1))
  )`);
  const insert = db.prepare("INSERT INTO quotes VALUES (?, ?, ?)");
  insert.run("Birinci söz", "https://example.com/1", 0);
  insert.run("İkinci söz", "https://example.com/2", 0);
  return db;
}

test("post yalnızca ham sözden oluşur", () => {
  const db = testDatabase();
  assert.equal(validateQuote(getNextQuote(db).quote), "Birinci söz");
  db.close();
});

test("başarılı paylaşım sonrası sıradaki söze geçer", () => {
  const db = testDatabase();
  const first = getNextQuote(db);
  markAsPosted(db, first.quote, first.startsNewCycle);
  assert.equal(getNextQuote(db).quote, "İkinci söz");
  db.close();
});

test("tüm sözler bitince yeni tur başlar", () => {
  const db = testDatabase();
  db.prepare("UPDATE quotes SET posted = 1").run();
  const next = getNextQuote(db);
  assert.equal(next.quote, "Birinci söz");
  assert.equal(next.startsNewCycle, true);
  markAsPosted(db, next.quote, next.startsNewCycle);
  assert.deepEqual(
    db.prepare("SELECT posted FROM quotes ORDER BY rowid").all().map((row) => row.posted),
    [1, 0],
  );
  db.close();
});

test("280 karakterden uzun söz reddedilir", () => {
  assert.throws(() => validateQuote("a".repeat(281)), /280/);
});
