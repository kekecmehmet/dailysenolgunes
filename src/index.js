import { TwitterApi } from "twitter-api-v2";
import { getNextQuote, markAsPosted, openDatabase, validateQuote } from "./database.js";

const db = openDatabase();
const record = getNextQuote(db);
const post = validateQuote(record.quote);

if (process.env.DRY_RUN === "true") {
  console.log(post);
  console.log(`\nKaynak (yalnızca inceleme için): ${record.source}`);
  db.close();
  process.exit(0);
}

if (process.env.CONFIRM_POST !== "true") {
  throw new Error("Gerçek paylaşım kilitli. CONFIRM_POST=true ayarlayın veya npm run dry-run kullanın.");
}

const requiredSecrets = ["X_API_KEY", "X_API_SECRET", "X_ACCESS_TOKEN", "X_ACCESS_SECRET"];
const missingSecrets = requiredSecrets.filter((name) => !process.env[name]);
if (missingSecrets.length) {
  throw new Error(`Eksik ortam değişkenleri: ${missingSecrets.join(", ")}`);
}

const client = new TwitterApi({
  appKey: process.env.X_API_KEY,
  appSecret: process.env.X_API_SECRET,
  accessToken: process.env.X_ACCESS_TOKEN,
  accessSecret: process.env.X_ACCESS_SECRET,
});

const response = await client.readWrite.v2.tweet(post);
markAsPosted(db, record.quote, record.startsNewCycle);
db.close();
console.log(`Paylaşıldı: https://x.com/i/web/status/${response.data.id}`);
