const crypto = require('crypto');

function DecryptData(data, ENCRYPTION_KEY) {
    let textParts = data.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedText);
   
    decrypted = Buffer.concat([decrypted, decipher.final()]);
   
    return decrypted.toString();
   }

export default DecryptData;