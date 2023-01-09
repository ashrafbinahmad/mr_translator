import mysql from 'mysql'

var db = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  port: parseInt(process.env.MYSQL_PORT),
  ssl: true
});

if (db.state == 'disconnected') db.connect();

export default db