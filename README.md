# Daily Şenol Güneş ☀️

Her gün Türkiye saatiyle 21:00'da, kaynağı kayıtlı bir Şenol Güneş sözünü X'te paylaşır. Post yalnızca sözün kendisinden oluşur; tırnak, imza, emoji ve kaynak eklenmez.

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

`Actions` sekmesindeki **Günlük Şenol Güneş sözü** işini önce varsayılan `dry_run: true` ile elle çalıştır. Logdaki metin doğruysa zamanlanmış iş her gün 21:00'da gerçek paylaşımı yapar.

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
