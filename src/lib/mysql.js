import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

console.log('Conectando ao banco de dados com as seguintes configurações:');
console.log(`Host: ${process.env.MYSQL_HOST}`);
console.log(`User: ${process.env.MYSQL_USER}`);
console.log(`Database: ${process.env.MYSQL_NAME}`);
console.log(`Password: ${process.env.MYSQL_PASSWORD}`);
console.log(`Port: ${process.env.MYSQL_PORT}`);

let connection;
export const createConnection = async () => {
    if (!connection) {
        connection = await mysql.createConnection({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            database: process.env.MYSQL_NAME,
            password: process.env.MYSQL_PASSWORD,
            port: process.env.MYSQL_PORT,
        });
    }
    return connection;
};
