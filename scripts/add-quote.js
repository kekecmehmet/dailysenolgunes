import { openDatabase, validateQuote } from "../src/database.js";

const [quoteArg, sourceArg] = process.argv.slice(2);
const quote = validateQuote(quoteArg);
if (!sourceArg?.startsWith("https://")) {
  throw new Error("İkinci argüman HTTPS kaynak adresi olmalı");
}

const db = openDatabase();
db.prepare("INSERT INTO quotes (quote, source, posted) VALUES (?, ?, 0)").run(
  quote,
  sourceArg,
);
db.close();
console.log("Söz eklendi.");
