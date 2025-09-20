Laloei Icons Pack
=================

ไฟล์นี้ประกอบด้วย:
- app-icons/: ไอคอน 3 ขนาดต่อแบบ (1024, 512, 256)
- ios/: ไฟล์ 1024x1024 สำหรับ App Store (ตั้งชื่อ *_AppStore_1024.png)
- web/: favicon/PWA ไซส์หลัก (512, 192, 180, 32, 16) พร้อม manifest.example.json
- android/: (placeholder) ใช้ไฟล์ 512/1024 จาก app-icons ได้

วิธีใช้งานสั้น ๆ
-----------------
iOS (Xcode):
1) เปิด Assets.xcassets > AppIcon
2) ลากไฟล์จาก ios/icon_01_AppStore_1024.png ลงช่อง 1024x1024 (App Store)
3) ที่เหลือให้ Xcode สเกลให้ หรือใช้ 1024 เป็นฐาน

Android (Adaptive Icon ง่าย ๆ):
- ใช้ไฟล์ 512x512 จาก app-icons/ (เช่น icon_01_512.png)
- ถ้าใช้ Android Studio: Mipmap Generator เลือกภาพ 512x512 แล้วสร้างไอคอนให้ครบ density

Web (React/Vite/Next):
1) คัดลอกโฟลเดอร์ web/ ไปวางใน public/
2) แก้ index.html ให้ใส่:
   <link rel="icon" href="/web/icon_01_32.png" sizes="32x32" />
   <link rel="apple-touch-icon" href="/web/icon_01_apple-touch-icon_180.png" />
   <link rel="manifest" href="/web/manifest.example.json" />
3) ปรับชื่อไฟล์/พาร์ทตามที่ต้องการ

Expo / React Native:
- ถ้าใช้ Expo: ใน app.json ใส่
  "icon": "app-icons/icon_01_1024.png"

ข้อแนะนำ:
- เผื่อ "safe padding" ประมาณ 10–15% รอบงานศิลป์ก่อน export
- ถ้าจะทำ Adaptive Icon ที่แท้จริง ควรมีเลเยอร์ foreground (โปร่งใส) + background (สี/gradient) แยก