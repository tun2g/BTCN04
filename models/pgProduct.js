const db= require('../configs/db')

const pgProduct = {
    
    allCategories: async () => {
        try {
            const rs = await db.any('SELECT * FROM "Categories"');
            return rs;
        } catch (err) {
            console.log(err);
        }
    },
    getProduct:async(type)=>{
        try{
            const rs = await db.any('SELECT * FROM "Products"WHERE "CategoryID"=$1',[type]);
            return rs;
        }
        catch(err){
            console.log(err)
        }
    }
    ,

    addUser: async (user) => {
        try {
            const findUser = await pgProduct.findUser(user.username);
            if (findUser) {
                return "Usernamehas already exists!";
            }
            const ID = await pgProduct.findMaxID();
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

    
    findProduct: async (id) => {
        try {
            const rs = await db.one('SELECT * FROM "Products" WHERE "ProductID"=$1', [id]);
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

module.exports = pgProduct;
