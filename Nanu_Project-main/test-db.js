const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        console.log('Connected to MySQL successfully!');
        await connection.end();
    } catch (error) {
        console.error('Failed to connect to MySQL:', error.message);
    }
}

testConnection();
