# 💰 PromptPay QR Code Generator
โปรเจกต์นี้เกิดขึ้นจากความต้องการของผมเอง
หลายครั้งที่เราอยากหารค่าบุฟเฟ่ต์กับเพื่อน หรืออยากให้เพื่อนโอนเงินที่ค้างไว้ให้ แต่ผมมักจะรู้สึก “ขี้เกียจ” ที่จะเข้าแอปธนาคาร เพื่อเปิด QR พร้อมเพย์ให้เพื่อนสแกนทุกครั้ง
ด้วยเหตุนี้ ผมจึงพัฒนาโปรเจกต์นี้ขึ้นมา เพื่อให้สามารถ “สร้างคิวอาร์โค้ดพร้อมเพย์ได้อย่างง่ายดาย” โดยไม่ต้องเปิดแอปธนาคารเองให้ยุ่งยาก และสามารถใส่ยอดเงินได้ ป้องกันการเพื่อนโอนเงินขาด
โปรเจกต์นี้ยังสามารถ จดจำข้อมูลเบอร์โทรศัพท์หรือเลขบัตรประชาชนของเราได้ (หากผู้ใช้เลือกอนุญาตให้จำข้อมูลไว้) โดยข้อมูลทั้งหมดจะถูกเก็บไว้ใน Local Storage เท่านั้น ซึ่งหมายความว่า ข้อมูลจะถูกบันทึกเฉพาะบนอุปกรณ์ของผู้ใช้เอง ไม่ถูกส่งไปเก็บที่เซิร์ฟเวอร์ใดๆ เพื่อความปลอดภัยของผู้ใช้
นอกจากนี้ ระบบยังมี API สำหรับนำไปใช้งานต่อในโปรเจกต์อื่น ๆ ได้อย่างสะดวก และสามารถต่อยอดเพื่อพัฒนาเป็นเครื่องมือสำหรับองค์กรหรือระบบภายในได้ในอนาคต
โปรเจกต์นี้พัฒนาด้วยเฟรมเวิร์ก Next.js ใช้เวลาทำโปรเจคประมาณ 3 ชั่วโมง ครับ

## ✨ ฟีเจอร์หลัก

### 📱 สร้าง QR Code พร้อมเพย์
- รองรับเบอร์โทรศัพท์มือถือ (10 หลัก)
- รองรับเลขบัตรประชาชน (13 หลัก)
- ระบุจำนวนเงินที่ต้องการรับ
- สร้าง QR Code ทันที พร้อมสแกน

### 🧮 ระบบหารเงิน
- หารเงินเท่าๆ กันได้หลายคน
- แสดงยอดเงินต่อคนอัตโนมัติ
- แสดงทั้งยอดเต็มและยอดที่หารแล้ว
- เหมาะสำหรับแชร์บิล ค่าอาหาร ค่าใช้จ่ายร่วมกัน

### 💾 บันทึกข้อมูล
- จำเบอร์โทรศัพท์หรือเลขบัตรประชาชนไว้
- ใช้ localStorage เก็บข้อมูลถาวร
- ไม่ต้องกรอกข้อมูลซ้ำทุกครั้ง
- ข้อมูลอยู่ในเครื่องของคุณเท่านั้น (ปลอดภัย 100%)


## 🚀 API Endpoint

นอกจากเว็บแอปแล้ว เรายังมี **REST API** ให้คุณเรียกใช้งานได้โดยตรง!

### สร้าง QR Code ผ่าน API

```
GET https://lunapromptpay-project.vercel.app/api/qrcode?mobile={PhoneNumber/ID}&amount={amount}
```

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `mobile` | string | ✅ Yes | เบอร์โทรศัพท์ (10 หลัก) หรือเลขบัตรประชาชน (13 หลัก) |
| `amount` | number | ❎ No | จำนวนเงิน (บาท) จะไม่ใส่ก็ได้ แต่ให้ลบ(&amount=) ออก |

#### ตัวอย่างการใช้งาน

**ใช้กับเบอร์โทรศัพท์:**
```
https://lunapromptpay-project.vercel.app/api/qrcode?mobile=0812345678&amount=150
```

**ใช้กับเลขบัตรประชาชน:**
```
https://lunapromptpay-project.vercel.app/api/qrcode?mobile=1234567890123&amount=500.50
```

#### Response
API จะ return QR Code เป็น **image (PNG)** สามารถนำไปใช้ได้ทันที

#### ตัวอย่างการใช้งานใน HTML
```html
<img src="https://lunapromptpay-project.vercel.app/api/qrcode?mobile=0812345678&amount=150" 
     alt="PromptPay QR Code" />
```

#### ตัวอย่างการใช้งานใน JavaScript
```javascript
const mobile = '0812345678';
const amount = 150;
const qrUrl = `https://lunapromptpay-project.vercel.app/api/qrcode?mobile=${mobile}&amount=${amount}`;

// แสดงใน Image Tag
document.getElementById('qr-image').src = qrUrl;

// หรือ fetch เพื่อประมวลผลเพิ่มเติม
fetch(qrUrl)
  .then(response => response.blob())
  .then(blob => {
    const imageUrl = URL.createObjectURL(blob);
    // ทำอะไรต่อกับ QR Code
  });
```

## 🛠️ เทคโนโลยีที่ใช้

- **Next.js 16+** - React Framework
- **React 19+** - UI Library
- **Tailwind CSS** - Styling
- **promptpay-qr** - Generate PromptPay Payload
- **qrcode** - Generate QR Code Image

## 📦 การติดตั้งและรัน

### 1. Clone Repository
```bash
git clone https://github.com/BugNoTensei/Lunapromptpay-Project
cd Lunapromptpay-Project
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. รันโปรเจค
```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:3000`

## 📁 โครงสร้างโปรเจค

```
promptpay-qr-generator/
├── app/
│   ├── page.jsx          # หน้าหลัก (PromptPay Generator)
│   ├── layout.js         # Layout
│   └── api/
│       └── qrcode/
│           └── route.js  # API Endpoint
├── public/               # Static files
├── package.json
└── README.md
```
## 🔒 ความปลอดภัย

- ✅ ข้อมูลทั้งหมดถูกประมวลผลในเบราว์เซอร์ของคุณ
- ✅ ไม่มีการส่งข้อมูลไปยังเซิร์ฟเวอร์ภายนอก
- ✅ localStorage เก็บข้อมูลไว้ในเครื่องเท่านั้น
- ✅ ไม่มีการเก็บล็อกหรือประวัติการใช้งาน

## ⭐ Support

ถ้าชอบโปรเจคนี้ อย่าลืม Star ⭐ ให้ด้วยนะครับ!

---

Made with ❤️ by [Panupat.Dev]
