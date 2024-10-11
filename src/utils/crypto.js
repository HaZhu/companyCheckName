import CryptoJS from 'crypto-js';

const keyStr = '1grLx91U40VawzhRAm7ES';
//随机生成指定数量的32进制key
//加密
const encrypt = (word) => {
  // 判断是否存在keyStr，不存在就用默认的keyStr（注意：这个keyStr必需要前后端统一，不然双方加密解密后会不相同。调用generatekey方法生成）
  let key = CryptoJS.enc.Utf8.parse(keyStr);
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
};
//解密
const decryptFn = (word) => {
  let key = CryptoJS.enc.Utf8.parse(keyStr);
  let decrypt = CryptoJS.AES.decrypt(word, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};
export { encrypt, decryptFn };
