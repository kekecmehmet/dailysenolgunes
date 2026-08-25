import { openDatabase, validateQuote } from "../src/database.js";

const [command, idArg, quoteArg, sourceArg] = process.argv.slice(2);
const db = openDatabase();

function parseId(value) {
  const id = Number.parseInt(value, 10);
  if (!Number.isSafeInteger(id) || id < 1) throw new Error("Geçerli bir söz numarası gerekli");
  return id;
}

try {
  if (command === "list") {
    const rows = db
      .prepare("SELECT rowid AS id, quote, source, posted FROM quotes ORDER BY rowid")
      .all();
    for (const row of rows) {
      console.log(`[${row.id}] ${row.posted ? "PAYLAŞILDI" : "BEKLİYOR"}`);
      console.log(row.quote);
      console.log(`Kaynak: ${row.source}\n`);
    }
  } else if (command === "stock") {
    const counts = db
      .prepare(`SELECT COUNT(*) AS total,
        SUM(CASE WHEN posted = 0 THEN 1 ELSE 0 END) AS remaining
        FROM quotes`)
      .get();
    console.log(`Toplam: ${counts.total} | Paylaşılmamış: ${counts.remaining}`);
    if (counts.remaining < 5) process.exitCode = 2;
  } else if (command === "edit") {
    const id = parseId(idArg);
    const quote = validateQuote(quoteArg);
    if (!sourceArg?.startsWith("https://")) throw new Error("HTTPS kaynak adresi gerekli");
    const result = db
      .prepare("UPDATE quotes SET quote = ?, source = ? WHERE rowid = ?")
      .run(quote, sourceArg, id);
    if (result.changes !== 1) throw new Error(`${id} numaralı söz bulunamadı`);
    console.log(`${id} numaralı söz güncellendi.`);
  } else if (command === "remove") {
    const id = parseId(idArg);
    const result = db.prepare("DELETE FROM quotes WHERE rowid = ?").run(id);
    if (result.changes !== 1) throw new Error(`${id} numaralı söz bulunamadı`);
    console.log(`${id} numaralı söz silindi.`);
  } else {
    throw new Error("Komut: list | stock | edit <no> <söz> <kaynak> | remove <no>");
  }
} finally {
  db.close();
}
