import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    port: 33306,
    user: 'otel',
    password: 'secret',
    database: 'test_db'
});
await connection.execute(`DROP TABLE IF EXISTS test_table2`)
await connection.execute(`
    CREATE TABLE test_table2 (
                                          id INT AUTO_INCREMENT PRIMARY KEY,
                                          value VARCHAR(255)
    )
`);

const [result] = await connection.execute('INSERT INTO test_table2 (value) VALUES (?)', ['Sample Value']);
console.log(`Inserted row with ID: ${result.insertId}`);

await connection.end();