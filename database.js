const { Client } = require('pg');

const Database = new Client({
    connectionString: "postgres://awfdismbwxryah:6208ee49ae63d6ce2ce95547f200ef885a0b7f41ae7c79d9d3fbf931cad6b896@ec2-34-198-189-252.compute-1.amazonaws.com:5432/d4keijfpsgdsi7",
    ssl: {
        rejectUnauthorized: false
    }
});

Database.connect();

module.exports = Database;