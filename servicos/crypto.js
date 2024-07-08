const validateDto = require('../middlewares/validateDto');
const { cryptoDto } = require('../dto/crypto/cryptoDto');
class Crypto{
    
    constructor(app, secretKey)
    {
        this.crypto = require('crypto');
        this.secretKey = secretKey

        app.post('/crypto/encrypt',validateDto(cryptoDto), (req, res) => {
            const text = this.encrypt(req.body.text)
            res.status(200).send({ text });
        });

        app.post('/crypto/decrypt',validateDto(cryptoDto), (req, res) => {
            const text = this.decrypt(req.body.text)
            res.status(200).send({ text });
        });

    }

    encrypt(text) {
        const cipher = this.crypto.createCipher('aes-256-cbc', this.secretKey);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }
      
    decrypt(text) {

        try {
            const decipher = this.crypto.createDecipher('aes-256-cbc', this.secretKey);
            let decrypted = decipher.update(text, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            return false
        }
        
    }

}
module.exports = Crypto;