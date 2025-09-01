# Spendex – Fullstack Kişisel Finans Uygulaması

Spendex; React Native (Expo) ile geliştirilen mobil istemci ve Node.js (Express) tabanlı bir REST API’den oluşan tam kapsamlı bir kişisel finans takip uygulamasıdır.

## İçerik

- Özellikler
- Mimari ve Teknolojiler
- Proje Yapısı
- Hızlı Başlangıç
- Ortam Değişkenleri
- Backend – Çalıştırma ve API’ler
- Mobile (Expo) – Çalıştırma
- Geliştirme Komutları
- Dağıtım Notları

## Özellikler

- Gelir/Gider işlemleri oluşturma, listeleme ve silme
- Kullanıcı bazlı özet: toplam bakiye, gelir ve gider
- Oran sınırlama (rate limit) ve güvenli API erişimi
- Mobil uygulamada modern ve akıcı UI/UX
- Profil resmi seçme/çekme, yerel saklama ile kişiselleştirme

## Mimari ve Teknolojiler

- Mobile: React Native 0.79, Expo 53, Expo Router, Clerk (kimlik), AsyncStorage, Image Picker
- Backend: Node.js, Express, Neon (PostgreSQL serverless), Upstash Redis (Rate Limit)

## Proje Yapısı

```
.
├─ backend/              # Express API
│  ├─ src/
│  │  ├─ config/        # db, cron, upstash ayarları
│  │  ├─ controllers/   # transactions controller
│  │  ├─ middleware/    # rate limiter
│  │  └─ routes/        # /api/transactions
│  └─ package.json
│
└─ mobile/               # Expo mobil uygulama
   ├─ app/              # Router + ekranlar
   ├─ assets/           # Görseller ve stiller
   ├─ components/       # UI bileşenleri
   ├─ constants/        # API URL vb.
   └─ package.json
```

## Hızlı Başlangıç

Önkoşullar:
- Node.js LTS (>=18)
- npm (veya pnpm/yarn) ve Git
- Android Studio / Xcode (emülatör/simülatör için) veya gerçek cihazda Expo Go

Kurulum:

```bash
git clone <repo_url>
cd Spendex

# Backend bağımlılıkları
cd backend && npm install

# Mobile bağımlılıkları
cd ../mobile && npm install
```

## Ortam Değişkenleri

Backend için kök dizinde `.env` (veya `backend/.env`) oluşturun:

```
DATABASE_URL=postgres://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
PORT=5001
NODE_ENV=development
```

Mobile için gerekli gizli anahtarlar (ör. Clerk publishable key) Expo ortam değişkeni olarak ayarlanmalıdır. Gerekirse `app.json` üzerinden veya `EXPO_PUBLIC_*` değişkenleriyle sağlayın.

## Backend – Çalıştırma ve API’ler

Geliştirme:

```bash
cd backend
npm run dev
```

Üretim:

```bash
cd backend
npm start
```

Varsayılan port: `http://localhost:5001`

API uçları (prefix: `/api`):

- `GET /api/health` – sağlık kontrolü
- `GET /api/transactions/:user_id` – kullanıcı işlemleri
- `POST /api/transactions` – işlem oluşturma
  - body: `{ title, amount, category, user_id }`
- `DELETE /api/transactions/:id` – işlem silme
- `GET /api/transactions/summary/:user_id` – bakiye/gelir/gider özeti

## Mobile (Expo) – Çalıştırma

```bash
cd mobile
npm start           # Expo geliştirici sunucusu
# veya
npm run android     # Android cihaz/emülatör
npm run ios         # iOS simülatör (macOS)
```

Uygulama; profil resmi yönetimi (kamera/galeri), işlem oluşturma/listeleme/silme ve canlı özet bileşenleri ile gelir-gider takibi sağlar. `mobile/constants/api.js` içinde API temel URL’i (`API_URL`) yapılandırılmıştır.

## Geliştirme Komutları

Backend:
- `npm run dev` – Nodemon ile geliştirme
- `npm start` – Üretim modu

Mobile:
- `npm start` – Expo geliştirici aracı
- `npm run android` – Android derleme/çalıştırma
- `npm run ios` – iOS çalıştırma (macOS)

## Dağıtım Notları

- Backend sunucusunu Render/Heroku/Fly.io gibi ortamlara dağıtabilir, PostgreSQL için Neon gibi serverless sağlayıcıları kullanabilirsiniz.
- Upstash Redis ile oran sınırlama (rate-limit) üretimde otomatik devreye girer (`NODE_ENV=production`).

---

Sorun/öneriler için GitHub Issues kullanabilirsiniz. İyi çalışmalar!


