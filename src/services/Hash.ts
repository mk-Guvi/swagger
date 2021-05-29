export {};
const bcrypt = require('bcrypt');
const saltrounds = 10;

const generateHash = plainText => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(plainText, saltrounds, (err, hash) => {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });
    });
};
const compareHash = (plainText, paswordHash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainText, paswordHash, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = { generateHash, compareHash };
