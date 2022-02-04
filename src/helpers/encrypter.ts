const crypto = require('crypto-browserify');
export class Encrypter {
    algorithm: string
    key: Buffer

    constructor(encryptionKey: string) {
        this.algorithm = "aes256";
        this.key = crypto.scryptSync(encryptionKey, "salt", 32);
    }

    encrypt(clearText: string) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        const encrypted = cipher.update(clearText, "utf8", "hex");
        return [
            encrypted + cipher.final("hex"),
            Buffer.from(iv).toString("hex"),
        ].join("|");
    }

    decrypt(encryptedText: string) {
        const [encrypted, iv] = encryptedText.split("|");
        if (!iv) throw new Error("IV not found");
        const decipher = crypto.createDecipheriv(
            this.algorithm,
            this.key,
            Buffer.from(iv, "hex")
        );
        return decipher.update(encrypted, "hex", "utf8") + decipher.final("utf8");
    }
}
