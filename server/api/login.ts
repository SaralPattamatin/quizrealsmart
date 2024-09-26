// server/api/login.ts
import { MongoClient } from "mongodb";
import { decrypt, encrypt } from "~/utils/crypto";
import jwt from "jsonwebtoken";

export default defineEventHandler(async (event) => {
  const body = await readBody(event); // อ่านข้อมูลจาก request

  const client = new MongoClient(
    "mongodb+srv://saralPat:Password1234@cluster0.veqer.mongodb.net/"
  );
  await client.connect();
  const db = client.db("user_database"); // ชื่อฐานข้อมูล
  const collection = db.collection("user_accounts"); // ชื่อ collection

  // ค้นหาผู้ใช้จากฐานข้อมูล
  const user = await collection.findOne({ username: body.username });

  if (!user) {
    return { error: "User not found" };
  }

  // ถอดรหัสรหัสผ่านที่เก็บไว้

  const decryptedPassword = decrypt(user.password, user.iv, "kkkkkkkkkkkkkkkkkkkkkkkkkkkk");
  // return { message: user , decryptedPassword :decryptedPassword};

  // ตรวจสอบว่ารหัสผ่านที่ผู้ใช้ป้อนตรงกับรหัสผ่านที่ถอดรหัสแล้วหรือไม่
  if (decryptedPassword === body.password) {
    // สร้าง token
    const secretKey = "your_jwt_secret_key"; // เปลี่ยนเป็น secret key สำหรับ JWT
    const token = jwt.sign({ id: user._id, username: user.username }, secretKey, {
      expiresIn: "1y", // กำหนดระยะเวลาหมดอายุของ token
    });

    // เข้ารหัส token ด้วย AES
    const aesSecretKey: string = "your_aes_secret_key"; // เปลี่ยนเป็น secret key สำหรับ AES
    const { encryptedData, iv } = encrypt(token, aesSecretKey);

    return { message: "Login successful" ,"status":"loginsuccessful", token: encryptedData, iv: iv };
  } else {
    return { error: "Invalid password","status":"loginfail" };
  }
});
