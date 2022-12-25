const db= require('../configs/db')

const CryptoJS = require("crypto-js");
const hashLength = 32;

const pgUser = {
    
    allUser: async () => {
        try {
            const rs = await db.any('SELECT * FROM "USERS"');
            return rs;
        } catch (err) {
            console.log(err);
        }
    },

    addUser: async (user) => {
        try {
            const findUser = await pgUser.findUser(user.username);
            if (findUser) {
                return "Username has already exists!";
            }
            const ID = await pgUser.findMaxID();
            let max
            !ID?max=0:max=ID.max
            const salt = Date.now().toString(16);
            const pwSalt = user.password + salt;
            const pwHashed = CryptoJS.SHA3(pwSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex);
            user.token="tk"
            const rs = await db.one(
                'INSERT INTO "Users"("UserID", "Username", "Password", "FullName", "Token", "Address") VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
                [max?max:0, user.username, pwHashed + salt, user.name,user.token, user.address]
            );
            return rs;
        } catch (err) {
            console.log(err);
            return "Failed!";
        }
    },

    checkLoginUser: async (user) => {
        try {
            const findUser = await pgUser.findUser(user.username);
            if (!findUser) {
                return "Username not exists!";
            }
            const pwDb = findUser.Password;
            const pwSalt = user.password + pwDb.slice(hashLength);
            const pwHashed = CryptoJS.SHA3(pwSalt, { outputLength: hashLength * 4 }).toString(CryptoJS.enc.Hex);
            if (pwDb === pwHashed + pwDb.slice(hashLength)) {
                return findUser;
            }
            return false;
        } catch (err) {
            console.log(err);
        }
    },

    findUser: async (username) => {
        try {
            const rs = await db.one('SELECT * FROM "Users" WHERE "Username"=$1', [username]);
            console.log(rs);
            return rs;
        } catch (err) {
            console.log(err);
        }
    },


    findMaxID: async () => {
        try {
            const rs = await db.one('SELECT MAX("UserID") FROM "Users"');
            return rs;
        } catch (err) {
            console.log(err);
        }
    },
};

module.exports = pgUser;
