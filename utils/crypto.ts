import CryptoJS from 'crypto-js';

export function encrypt(plainText: string, key: string) {
  const iv = CryptoJS.lib.WordArray.random(16); // สร้าง IV
  const encrypted = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(key), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return {
    iv: iv.toString(CryptoJS.enc.Hex), // เก็บ IV ในรูปแบบ Hex string
    encryptedData: encrypted.toString()
  };
}

export function decrypt(cipherText: string, iv: string, key: string) {
  const decrypted = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Hex.parse(iv), // แปลง IV กลับจาก Hex string
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return decrypted.toString(CryptoJS.enc.Utf8);
}
