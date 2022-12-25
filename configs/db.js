const initOptions = {
    connect(client, dc, useCount) {
        const cp = client.connectionParameters;
    },
};
const pgp = require("pg-promise")(initOptions);

const cn=require('./cnStr')

const db = pgp(cn);

module.exports=db