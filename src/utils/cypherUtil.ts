// @ts-ignore
import * as fpe from 'node-fpe';

export const encrypt = (message: string, secret: string) => {
   const cipher = fpe({ password: secret});
   return cipher.encrypt(message.padStart(11, '0'));
};

export const decrypt = (encryptedMessage: string, secret: string) => {
   const cipher = fpe({ password: secret});
   return cipher.decrypt(encryptedMessage);
};


