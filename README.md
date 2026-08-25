# Daily Şenol Güneş ☀️

Her gün Türkiye saatiyle 21.00'de [@daily_senol](https://x.com/daily_senol) hesabından, kaynağı doğrulanmış bir Şenol Güneş sözü paylaşan açık kaynak bot.

Post yalnızca sözün kendisinden oluşur; tırnak, imza, emoji, hashtag ve kaynak bağlantısı eklenmez. Kaynaklar inceleme amacıyla SQLite veritabanında saklanır.

## Nasıl çalışır?

- GitHub Actions her gün 18.00 UTC'de (Türkiye saatiyle 21.00) botu çalıştırır.
- Bot `posted = 0` olan ilk sözü seçer ve X API v2 ile paylaşır.
- X başarılı cevap verdikten sonra sözü `posted = 1` olarak işaretler.
- Güncellenen veritabanı otomatik olarak repoya commit edilir.
- Normal kod push'ları gerçek post atmaz; test ve dry-run çalıştırır.

## Önce hesabı hazırla

1. X hesabını aç. Profilde bunun **resmî olmayan bir fan hesabı** olduğunu açıkça yaz.
2. [X Developer Console](https://console.x.com/) üzerinden bir uygulama oluştur.
3. Uygulama iznini **Read and Write** yap.
4. İzni değiştirdikten sonra API Key/Secret ile Access Token/Secret değerlerini yeniden üret.
5. X API kredisi satın al ve düşük bir harcama limiti belirle. Günde tek, bağlantısız paylaşım güncel liste fiyatıyla yaklaşık **$0.015**, 30 günde yaklaşık **$0.45** tutar.

> Anahtarları `.env` dosyasına, koda veya Git geçmişine koyma.

## Yerelde dene

Node.js 22 veya üstü gerekir.

```bash
npm install
npm run db:init
npm test
npm run dry-run
```

Gerçek paylaşımı yerelde çalıştıracaksan `.env.example` içindeki dört değeri ortam değişkeni olarak yükle ve güvenlik kilidini aç:

```bash
CONFIRM_POST=true npm start
```

## GitHub Actions ile her gün çalıştır

Repoyu GitHub'a gönderip **Settings → Secrets and variables → Actions** bölümüne şu repository secret'larını ekle:

- `X_API_KEY`
- `X_API_SECRET`
- `X_ACCESS_TOKEN`
- `X_ACCESS_SECRET`

`Actions` sekmesindeki **Günlük Şenol Güneş sözü** işini önce varsayılan `dry_run: true` ile elle çalıştır. Logdaki metin doğruysa zamanlanmış iş her gün 21.00'de gerçek paylaşımı yapar.

Başarılı paylaşımdan sonra veritabanındaki `posted` sütunu güncellenir ve workflow bu değişikliği repoya kaydeder. GitHub zamanlayıcısı yoğunlukta birkaç dakika gecikebilir. Elle çalıştırma varsayılan olarak dry-run'dır.

## Söz eklemek

SQLite veritabanındaki tablo tam olarak üç sütunludur: `quote`, `source`, `posted`. Yeni söz eklemek için:

```bash
npm run db:add -- "Şenol Güneş'in sözü" "https://kaynak-adresi.example"
npm test
```

Arşivi yönetmek için:

```bash
# Kaynakları ve paylaşım durumlarını listele
npm run db:list

# Kalan paylaşılmamış söz sayısını göster
npm run db:stock

# Bir sözü ve kaynağını düzelt
npm run db:edit -- 12 "Düzeltilmiş söz" "https://kaynak.example"

# Uygun olmayan bir sözü sil
npm run db:remove -- 12
```

Yönetim komutlarından sonra `data/quotes.db` dosyasındaki değişikliği commit edip GitHub'a göndermek gerekir.

Kaynak yalnızca senin incelemen için saklanır, postun içine girmez. Bot paylaşılmamış ilk sözü seçer, X başarılı cevap verince `posted` değerini `1` yapar. Bütün sözler bitince yeni tur otomatik başlar.

## Güvenlik

- Gerçek API anahtarları yalnızca GitHub Actions Secrets içinde tutulur.
- `.env` ve yaygın anahtar/sertifika dosyaları `.gitignore` kapsamındadır.
- Gerçek paylaşım için ayrıca `CONFIRM_POST=true` güvenlik kilidi gerekir.
- Kod push'ları yalnızca dry-run çalıştırır; gerçek paylaşım zamanlayıcıdan veya açıkça onaylanmış manuel çalıştırmadan yapılır.

## Lisans ve açıklama

Kod [MIT Lisansı](LICENSE) ile yayımlanmıştır. Bu proje resmî olmayan bir fan projesidir; Şenol Güneş veya bağlı olduğu kurumlarla resmî ilişkisi yoktur. Alıntıların hakları ilgili sahiplerine aittir.
