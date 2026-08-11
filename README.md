# e-utilities-cost

ระบบควบคุม-ติดตามค่าสาธารณูปโภค (Utility Expense Tracking & Control System)

โครงสร้างโปรเจกต์นี้สร้างขึ้นตามแผนใน `plan.md` — ใช้ Node.js/Express + Vue 3 + MariaDB
ครบทั้ง Auth (JWT), CRUD, Dashboard และ Docker Compose

## โครงสร้างโปรเจกต์

```
e-utilities-cost/
├── backend/     # Express API + Sequelize + MariaDB
├── frontend/    # Vue 3 + Vite + Tailwind + Pinia
├── docker-compose.yml
└── .env.example
```

## วิธีรันแบบ Local (Development)

### 1. ตั้งค่า Environment Variables

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

แก้ไขค่าใน `.env` โดยเฉพาะ `JWT_SECRET`, `REFRESH_TOKEN_SECRET` และรหัสผ่านฐานข้อมูลให้เป็นค่าที่ปลอดภัย

### 2. รันฐานข้อมูล (MariaDB + phpMyAdmin) ด้วย Docker

```bash
docker compose up -d mariadb phpmyadmin
```

phpMyAdmin จะอยู่ที่ http://localhost:8081

### 3. รัน Backend

```bash
cd backend
npm install
npm run seed   # สร้าง admin user + seed ข้อมูลเริ่มต้น (username: admin, password: admin1234)
npm run dev    # รันที่ http://localhost:3000
```

### 4. รัน Frontend

```bash
cd frontend
npm install
npm run dev    # รันที่ http://localhost:5173
```

เข้าสู่ระบบด้วย `admin` / `admin1234` (**ควรเปลี่ยนรหัสผ่านทันทีในระบบจริง**)

## วิธีรันด้วย Docker Compose (Production-like)

```bash
cp .env.example .env
# แก้ไขค่าใน .env ให้เรียบร้อย

docker compose up -d --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- phpMyAdmin: http://localhost:8081

หลัง container backend รันขึ้นแล้ว ให้ seed ข้อมูลเริ่มต้น:

```bash
docker compose exec backend node src/seed.js
```

## Build & Push ขึ้น Docker Hub

```bash
docker login

docker build -t <dockerhub-username>/e-utilities-cost-backend:latest ./backend
docker build -t <dockerhub-username>/e-utilities-cost-frontend:latest ./frontend

docker push <dockerhub-username>/e-utilities-cost-backend:latest
docker push <dockerhub-username>/e-utilities-cost-frontend:latest
```

## API Endpoints หลัก

| Method | Endpoint | รายละเอียด |
|---|---|---|
| POST | /api/auth/login | เข้าสู่ระบบ |
| POST | /api/auth/logout | ออกจากระบบ |
| POST | /api/auth/refresh | ขอ accessToken ใหม่ |
| GET | /api/auth/me | ข้อมูลผู้ใช้ปัจจุบัน |
| GET/POST/PUT/DELETE | /api/expense-categories | จัดการประเภทค่าใช้จ่าย |
| GET/POST/PUT/DELETE | /api/budget-categories | จัดการหมวดเงิน |
| GET/POST/PUT/DELETE | /api/expenses | จัดการรายการค่าใช้จ่าย |
| GET | /api/dashboard/summary?year= | สรุปยอดรายเดือนทั้งปี |
| GET | /api/dashboard/by-category?year= | สรุปแยกตามประเภทค่าใช้จ่าย |
| GET | /api/dashboard/by-budget?year= | สรุปแยกตามหมวดเงิน |
| GET | /api/dashboard/compare?year1=&year2= | เปรียบเทียบปีต่อปี |

## หมายเหตุด้านความปลอดภัย

- Password เก็บแบบ bcrypt hash (salt rounds 10)
- JWT accessToken อายุสั้น (1 ชม.) + refreshToken เก็บใน httpOnly cookie
- Frontend เก็บ accessToken ใน memory (Pinia) เท่านั้น ไม่ใช้ localStorage
- ใช้ helmet, cors (จำกัด origin), express-rate-limit ที่ endpoint login
- **อย่าลืม** เปลี่ยนค่า `JWT_SECRET`, `REFRESH_TOKEN_SECRET` และรหัสผ่านฐานข้อมูลก่อนใช้งานจริง
- ไม่ควร commit ไฟล์ `.env` ขึ้น git (มี `.gitignore` ครอบคลุมไว้แล้ว)

## งานที่ยังไม่ได้ทำ (ส่วนขยายในอนาคต)

- Export รายงานเป็น PDF/Excel
- ระบบแจ้งเตือนเมื่อค่าใช้จ่ายเดือนใดสูงผิดปกติ (threshold alert)
- แนบไฟล์ใบเสร็จ/สลิปโอนเงิน
- Multi-branch / multi-site support
- Role-based permission ละเอียดขึ้น
