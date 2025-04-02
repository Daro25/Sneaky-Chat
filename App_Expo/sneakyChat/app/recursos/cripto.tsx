import RNRsaNative, { RSA } from 'react-native-rsa-native';

export const generateKeys = async () => {
  try {
    const keys = await RSA.generateKeys(512);
    
    console.log('Clave Pública:', keys.public);
    console.log('Clave Privada:', keys.private);
  } catch (error) {
    console.error('Error generando las claves:', error);
  }
};
export const encryptMessage = async (message: string, publicKey: string) => {
    const encrypted = await RSA.encrypt(message, publicKey);
    console.log('Mensaje Encriptado:', encrypted);
    return encrypted;
};

export const decryptMessage = async (encryptedMessage: string, privateKey: string) => {
    const decrypted = await RSA.decrypt(encryptedMessage, privateKey);
    console.log('Mensaje Desencriptado:', decrypted);
    return decrypted;
};

export default function name() {}