import { MongoClient } from 'mongodb';
import { encrypt } from '~/utils/crypto';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event); // อ่านข้อมูลจาก request

    // ตรวจสอบความถูกต้องของข้อมูล
    // if (!body.username || !body.password) {
    //   return { error: 'Username and password are required' };
    // }

    // if (body.password.length < 8) {
    //   return { error: 'Password must be at least 8 characters long' };
    // }

    const client = new MongoClient('mongodb+srv://saralPat:Password1234@cluster0.veqer.mongodb.net/');
    await client.connect();
    const db = client.db('user_database'); // ชื่อฐานข้อมูล
    const collection = db.collection('user_accounts'); // ชื่อ collection

    // ตรวจสอบว่ามีชื่อผู้ใช้นี้อยู่ในระบบหรือไม่
    const existingUser = await collection.findOne({ username: body.username });
    if (existingUser) {
      return { error: 'Username already exists' };
    }

    // เข้ารหัสรหัสผ่าน
    const { iv, encryptedData } = encrypt(body.password, "kkkkkkkkkkkkkkkkkkkkkkkkkkkk");

    // บันทึกข้อมูลบัญชีผู้ใช้ใน MongoDB
    await collection.insertOne({
      username: body.username,
      password: encryptedData,
      iv: iv,
      createdAt: new Date()
    });

    return { message: 'Account created successfully' };
  } catch (error) {
    console.error('Error creating account:', error);
    return { error: 'Failed to create account, please try again later.' };
  }
});
