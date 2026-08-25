import Database from "better-sqlite3";
import { fileURLToPath } from "node:url";

export const databasePath = fileURLToPath(new URL("../data/quotes.db", import.meta.url));

export function openDatabase() {
  const db = new Database(databasePath);
  db.pragma("journal_mode = DELETE");
  db.exec(`
    CREATE TABLE IF NOT EXISTS quotes (
      quote TEXT PRIMARY KEY NOT NULL,
      source TEXT NOT NULL,
      posted INTEGER NOT NULL DEFAULT 0 CHECK (posted IN (0, 1))
    )
  `);
  return db;
}

export function validateQuote(quote) {
  if (typeof quote !== "string" || !quote.trim()) {
    throw new Error("Söz boş olamaz");
  }
  if ([...quote.trim()].length > 280) {
    throw new Error("Söz 280 karakteri aşıyor");
  }
  return quote.trim();
}

export function getNextQuote(db) {
  const unposted = db
    .prepare("SELECT quote, source, posted FROM quotes WHERE posted = 0 ORDER BY rowid LIMIT 1")
    .get();

  if (unposted) return { ...unposted, startsNewCycle: false };

  const first = db
    .prepare("SELECT quote, source, posted FROM quotes ORDER BY rowid LIMIT 1")
    .get();
  if (!first) throw new Error("Veritabanında paylaşılacak söz yok");
  return { ...first, startsNewCycle: true };
}

export function markAsPosted(db, quote, startsNewCycle = false) {
  const update = db.transaction(() => {
    if (startsNewCycle) db.prepare("UPDATE quotes SET posted = 0").run();
    const result = db.prepare("UPDATE quotes SET posted = 1 WHERE quote = ?").run(quote);
    if (result.changes !== 1) throw new Error("Paylaşılan söz veritabanında bulunamadı");
  });
  update();
}
