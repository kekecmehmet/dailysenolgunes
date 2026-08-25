import { openDatabase } from "../src/database.js";

const sourceAjans = "https://ajansbesiktas.com/senol-gunesin-unutulmaz-sozleri-80g-149108h.htm";
const sourceGq = "https://gq.com.tr/roportaj/son-dunya-kupasi-kahramanimiz";
const sourceHt = "https://www.haberturk.com/spor/futbol/haber/1030263-adalet-ve-egitim";

const quotes = [
  [
    "Önemli olan yağmur yağdığı zaman şikayetçi olmak yerine yağmur yağdığını bilmek ama gerekirse de söylemek lazım. Yağmur yağdığını söylediğinizde beni ördek yerine mi koyuyorsunuz derlerse o adamın kendi şüphesidir.",
    "https://www.milligazete.com.tr/haber/1237669/senol-gunes-yagmur-yaginca-bana-ordek-mi-diyorsun-diye-alinganlik-gosterenler-var",
  ],
  ["Ben mükemmel değilim ama mükemmelliği kovalayan biriyim.", sourceAjans],
  ["Adalet zengin bir hazinedir, günü gelince herkese lazım olur.", sourceAjans],
  ["Nereden geldiğini bilmezsen, bulunduğun yerden hep şikâyetçi olursun.", sourceAjans],
  ["Önemli olan neye sahip olduğunuz değil, kiminle paylaştığınızdır.", sourceAjans],
  ["Emek veren bir takım olarak, paraya karşı yetenek ve emeğin savaşını verdik. Tarih bunları da yazar.", sourceAjans],
  ["Bütün renkleri seviyoruz ama en güzeli siyah-beyaz.", sourceAjans],
  ["Biz Türkiye’de en iyi futbol oynayan ikinci takımız. Birinci daha çıkmadı.", sourceAjans],
  ["Benim için başarı ve başarısızlık aynı mesafede duruyor. İkisi de tehlikelidir.", sourceAjans],
  ["Her basamak önemlidir. Basamağın ilkine basmadan o zirveye çıkamazsınız.", sourceAjans],
  ["Fikri ve vicdanı hür insanlarız, Mustafa Kemal çocuklarıyız; sözü esirgemek gibi bir durumumuz yok.", sourceAjans],
  ["Ben size torunlarınıza anlatacağınız bir hikâye yazdım, nasıl anlatmak istediğiniz size kalmış.", sourceGq],
  ["Başarısızlığın hesabını çok güzel kesen bir milletiz. Başarının karşılığını ödüllendirmediğimiz sürece, daha çok hesap keseriz.", sourceGq],
  ["Sportif başarıyı garantileyemeyeceğimi biliyordum ama takımın bir duruşu olsun istedim.", sourceGq],
  ["Benim için değerli olan takımımın karakteriydi.", sourceGq],
  ["Küskün değilim, belki kırgınım. Ama kırgınlıklarımla da yaşamayı öğrendim.", sourceGq],
  ["Şüpheyle bakılan yerde huzur da mutluluk da olmaz.", sourceHt],
  ["Futbol, yok etme savaşı değildir.", sourceHt],
  ["Kendini geliştiremediği ve hatalarından ders almadığı için birçok oyuncu profesyonel düzeye geldiği zaman kayboluyor.", sourceHt],
  ["İçe sinmeyen sistem yürümez, bir gün patlar.", sourceHt],
  ["Oyuncu isterse bu iş oluyor.", sourceHt],
];

const db = openDatabase();
const insert = db.prepare(
  "INSERT OR IGNORE INTO quotes (quote, source, posted) VALUES (?, ?, 0)",
);
const seed = db.transaction((rows) => {
  for (const [quote, source] of rows) insert.run(quote, source);
});
seed(quotes);

const count = db.prepare("SELECT COUNT(*) AS count FROM quotes").get().count;
db.close();
console.log(`Veritabanı hazır: ${count} söz`);
