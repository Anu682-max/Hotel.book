# 🚀 Deployment Заавар

Энэхүү төслийг дараах платформууд дээр deploy хийх боломжтой.

---

## 1️⃣ Vercel дээр Deploy (Зөвлөж байна) ⭐

### Яагаад Vercel вэ?
- Next.js-ийн албан ёсны платформ
- **Үнэгүй** hosting бүгдэд хүрэлцэнэ
- Автомат HTTPS, CDN
- Секундын дотор deployment
- Environment variables хялбар удирдлага

### Алхмууд:

**A. GitHub Repository үүсгэх**
```bash
# Төслийн хавтас дотор
cd 14.1-rakuten-api
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/таны-username/hotel-booking.git
git push -u origin main
```

**B. Vercel дээр Deploy хийх**

1. [vercel.com](https://vercel.com) - GitHub-аар нэвтрэх
2. **"Add New Project"** дарах
3. Repository сонгох
4. **Environment Variables** оруулах:
   ```
   NEXT_PUBLIC_RAKUTEN_APP_ID = 1011166765460964150
   NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID = таны_affiliate_id
   ```
5. **Deploy** дарах

✅ 1-2 минутын дараа: `https://таны-app-name.vercel.app` дээр ажиллана!

---

## 2️⃣ Netlify дээр Deploy

### Алхмууд:

1. [netlify.com](https://netlify.com) - бүртгүүлэх
2. **"Add new site"** → **"Import an existing project"**
3. GitHub repository холбох
4. Build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Environment variables нэмэх
6. **Deploy** дарах

Netlify Plugin суулгах:
```bash
npm install --save-dev @netlify/plugin-nextjs
```

---

## 3️⃣ Railway дээр Deploy

### Алхмууд:

1. [railway.app](https://railway.app) - бүртгүүлэх
2. **"New Project"** → **"Deploy from GitHub repo"**
3. Repository сонгох
4. Environment variables нэмэх
5. Автоматаар deploy хийнэ

**CLI ашиглах:**
```bash
npm install -g @railway/cli
railway login
railway init
railway up
```

---

## 4️⃣ Render дээр Deploy

### Алхмууд:

1. [render.com](https://render.com) - бүртгүүлэх
2. **"New +"** → **"Web Service"**
3. Repository холбох
4. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Environment variables нэмэх

---

## 5️⃣ DigitalOcean App Platform

### Алхмууд:

1. [cloud.digitalocean.com/apps](https://cloud.digitalocean.com/apps)
2. **"Create App"** → GitHub repository сонгох
3. Build & Deploy settings автоматаар таниулагдана
4. Environment variables нэмэх
5. Deploy хийх

---

## ⚙️ Environment Variables (Бүх платформд шаардлагатай)

Deploy хийхдээ эдгээр хувьсагчдыг заавал нэмнэ үү:

```env
NEXT_PUBLIC_RAKUTEN_APP_ID=1011166765460964150
NEXT_PUBLIC_RAKUTEN_AFFILIATE_ID=таны_affiliate_id_энд
```

---

## 🔧 Build командууд

Локал машин дээр build шалгах:

```bash
# Production build хийх
npm run build

# Production режимд ажиллуулах
npm start
```

Build амжилттай болохыг шалгаарай deployment хийхээсээ өмнө!

---

## 📱 Custom Domain холбох

Deployment амжилттай болсны дараа:

**Vercel:**
1. Project Settings → Domains
2. Custom domain нэмэх
3. DNS records шинэчлэх

**Netlify:**
1. Site Settings → Domain Management
2. Custom domain нэмэх
3. DNS тохируулах

---

## 🎯 Deployment Checklist

Deploy хийхээсээ өмнө эдгээрийг шалгаарай:

- ✅ `npm run build` локал дээр амжилттай ажиллаж байна
- ✅ `.env.local` файл байгаа (локал хөгжүүлэлтэд)
- ✅ Environment variables бэлэн байна (production-д)
- ✅ `.gitignore` дотор `.env.local`, `node_modules` орсон байна
- ✅ Rakuten API key хүчинтэй байна
- ✅ GitHub repository public эсвэл private (платформоос хамаарч)

---

## 🐛 Түгээмэл Алдаа Засах

### Build амжилтгүй болж байна
```bash
# Dependencies дахин суулгах
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variables уншихгүй байна
- Хувьсагчийн нэр зөв байгаа эсэхийг шалга (`NEXT_PUBLIC_` prefix шаардлагатай)
- Deployment дараа хувьсагч нэмсэн бол **redeploy** хийх хэрэгтэй

### API хүсэлт ажиллахгүй байна
- Browser Console-д алдаа шалга
- Network tab-аар API хүсэлт очиж байгаа эсэхийг шалга
- CORS алдаа гарч байвал Rakuten API settings шалга

---

## 🎉 Амжилттай Deployment!

Deployment амжилттай болсны дараа та дараах зүйлсийг хийж болно:

- 🔗 URL хуваалцах найз нөхөдтэйгөө
- 📊 Analytics нэмэх (Google Analytics, Vercel Analytics)
- 🎨 Custom domain холбох
- 🚀 Шинэ features нэмж хөгжүүлэлт үргэлжлүүлэх

---

**Асуулт байвал эсвэл тусламж хэрэгтэй бол:**
- GitHub Issues үүсгэх
- Documentation уншаx: [Next.js Deployment](https://nextjs.org/docs/deployment)
- Community-аас тусламж авах

Амжилт хүсье! 🎊
