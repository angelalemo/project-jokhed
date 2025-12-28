# People Management API

## Overview

People Management API เป็นระบบ Backend สำหรับจัดการข้อมูลบุคคล  
พัฒนาด้วย **NestJS** โดยออกแบบตามหลัก **Modular Architecture**, **Layered Architecture** และ **Clean Code Principles**

ระบบนี้ถูกออกแบบมาเพื่อรองรับการใช้งานร่วมกับ Web Application สำหรับแสดงข้อมูลบุคคล เช่น

- ชื่อ – นามสกุล
- ชื่อเล่น (Nickname)
- เบอร์โทรศัพท์
- รูปภาพ

ฐานข้อมูลหลักใช้ **PostgreSQL** และโครงสร้างโปรเจคถูกเตรียมให้พร้อมสำหรับการใช้งานร่วมกับ **Docker** ในอนาคต

---

## Architecture Concept

ระบบใช้แนวคิด **Separation of Concerns** โดยแยกความรับผิดชอบของแต่ละชั้นอย่างชัดเจน

ลำดับการทำงานของระบบ

Controller → Service → Repository → Database


แนวคิดหลักที่ใช้
- Modular Architecture
- Layered Architecture
- Clean Code & Maintainability
- Scalability Friendly

---

## Project Structure

src/
│
├── main.ts
├── app.module.ts
│
├── config/
│ ├── database.config.ts
│ └── env.config.ts
│
├── common/
│ ├── constants/
│ ├── middlewares/
│ ├── filters/
│ ├── guards/
│ ├── interceptors/
│ └── utils/
│
├── modules/
│ └── people/
│ ├── people.module.ts
│ ├── people.controller.ts
│ ├── people.service.ts
│ ├── people.repository.ts
│ │
│ ├── dto/
│ │ ├── create-person.dto.ts
│ │ └── update-person.dto.ts
│ │
│ ├── entities/
│ │ └── person.entity.ts
│ │
│ └── enums/
│ └── person-status.enum.ts
│
├── database/
│ ├── migrations/
│ └── seeds/
│
└── health/
├── health.module.ts
└── health.controller.ts
---

## Folder Responsibilities

### 1. config

ใช้สำหรับจัดเก็บไฟล์ตั้งค่ากลางของระบบ เช่น
- การเชื่อมต่อฐานข้อมูล PostgreSQL
- การจัดการ environment variables
- การแยก configuration ออกจาก business logic

---

### 2. common

โค้ดที่ใช้ร่วมกันทั้งระบบ โดยไม่ผูกกับ Domain ใด Domain หนึ่ง  
ใช้สำหรับจัดการพฤติกรรมระดับโครงสร้าง (Infrastructure) และโค้ดที่นำกลับมาใช้ซ้ำได้

#### constants
- ใช้สำหรับเก็บค่าคงที่ (Constant Values) ที่ถูกใช้งานซ้ำในหลายส่วนของระบบ
- ลดการใช้ magic string และ magic number
- เพิ่มความสม่ำเสมอและความอ่านง่ายของโค้ด

#### middlewares
- ทำงานทันทีเมื่อมี HTTP Request เข้าสู่ระบบ
- ใช้สำหรับงานระดับต้นของ request lifecycle
- ไม่เกี่ยวข้องกับ business logic

#### filters
- จัดการ Exception และ Error ที่เกิดขึ้นในระบบ
- แปลง Error ให้อยู่ในรูปแบบ Response มาตรฐานเดียวกัน

#### guards
- ตรวจสอบสิทธิ์การเข้าถึง (Authentication / Authorization)
- ทำงานก่อนเข้าสู่ Controller

#### interceptors
- ดักจับ Request และ Response
- ใช้สำหรับ logging, transform response และเพิ่ม metadata

#### utils
- ฟังก์ชันช่วยเหลือทั่วไป
- ไม่ติดต่อฐานข้อมูลและไม่พึ่งพา Service อื่น

---

### 3. modules/people

เป็น Domain หลักของระบบ ใช้จัดการข้อมูลบุคคล

#### people.controller.ts
- รับ HTTP Request จาก Client
- ส่งต่อข้อมูลไปยัง Service
- ไม่มี Business Logic

#### people.service.ts
- ประมวลผล Business Logic ของระบบ
- ตรวจสอบเงื่อนไขทางธุรกิจ
- เรียกใช้งาน Repository

#### people.repository.ts
- ติดต่อฐานข้อมูลโดยตรง
- ไม่มี Business Logic
- แยก ORM หรือ Database Layer ออกจาก Service

---

### enums

ใช้สำหรับกำหนดค่าคงที่แบบจำกัดขอบเขต (Enumeration)

- ป้องกันการใช้ค่าที่ไม่ถูกต้อง
- ลดการใช้ string แบบ hardcode
- เพิ่มความชัดเจนของ business rules

ตัวอย่างการใช้งาน:
- สถานะของบุคคล (ACTIVE, INACTIVE)
- ประเภทหรือหมวดหมู่ข้อมูล

---

### 4. dto (Data Transfer Object)

- กำหนดรูปแบบข้อมูลที่รับเข้าและส่งออก
- ใช้สำหรับ Validation
- ลดความผิดพลาดจากข้อมูลที่ไม่ถูกต้อง

---

### 5. entities

ใช้กำหนดโครงสร้างของฐานข้อมูล

- 1 Entity แทน 1 Table ใน PostgreSQL
- ใช้สำหรับ ORM Mapping

**Person Entity ประกอบด้วยข้อมูลหลัก**
- id
- firstName
- lastName
- nickname
- phone
- imageUrl
- createdAt
- updatedAt

---

### 6. database

#### migrations
- จัดการการเปลี่ยนแปลงโครงสร้างฐานข้อมูล
- ควบคุม version ของ schema

#### seeds
- ใช้สำหรับสร้างข้อมูลตัวอย่างเริ่มต้น
- ใช้ในขั้นตอนพัฒนา ทดสอบ หรือ demo
- ไม่ใช้ใน production

---

### 7. health

ใช้สำหรับตรวจสอบสถานะของระบบ (Health Check)

- ตรวจสอบว่า Server ยังทำงานอยู่หรือไม่
- ใช้ร่วมกับ Docker, Load Balancer หรือ Cloud Platform
- ไม่มี Business Logic

ตัวอย่าง Endpoint:
GET /health

---

## API Endpoints 

GET /people
POST /people
GET /people/:id
PUT /people/:id
DELETE /people/:id

---

## Image Management Strategy

- ไม่จัดเก็บไฟล์รูปภาพในฐานข้อมูลโดยตรง
- จัดเก็บรูปภาพเป็นไฟล์หรือ Cloud Storage
- ฐานข้อมูลจะจัดเก็บเฉพาะ URL ของรูปภาพ (`imageUrl`)

---


