# Garage Checkout POS

ระบบคิดเงินอะไหล่รถ + สแกน screenshot ด้วย **Gemini AI ฝั่งเซิร์ฟเวอร์** (Cloudflare Pages Functions)

## Deploy บน Cloudflare Pages

### 1) อัปโหลดโปรเจกต์
- เชื่อม GitHub แล้วสร้าง Pages project จาก repo นี้
- หรือ `npx wrangler pages deploy . --project-name garage-checkout`

### 2) ใส่ Gemini API Key บนเซิร์ฟเวอร์ (ไม่โชว์หน้าเว็บ)
```bash
npx wrangler pages secret put GEMINI_API_KEY --project-name garage-checkout
```
สร้าง key ได้ที่ https://aistudio.google.com/apikey

### 3) ใช้งาน
เปิดเว็บที่ Cloudflare → กด **สแกนรูป** → วาง screenshot → ยืนยันลงบิล

## ทดสอบ local
```bash
echo 'GEMINI_API_KEY=your_key' > .dev.vars
npx wrangler pages dev . --port 8788
```
เปิด http://localhost:8788

> เปิด index.html ตรง ๆ จะสแกนไม่ได้ เพราะไม่มี `/api/scan`

## ความปลอดภัย
- ห้าม commit `.dev.vars`
- ห้ามใส่ API key ใน frontend
- ถ้า key เคยโผล่ในแชท/Git → สร้าง key ใหม่แล้ว secret put ใหม่
