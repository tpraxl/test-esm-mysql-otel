import mysql from 'mysql2';

// Create a connection
const connection = mysql.createConnection({
    host: 'localhost',
    port: 33306,
    user: 'otel',
    password: 'secret',
    database: 'test_db'
});

// Connect to the database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');

    const dropTableQuery = `DROP TABLE IF EXISTS test_table2`;
    connection.query(dropTableQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return;
        }
        console.log('Table dropped if existed.');

        const createTableQuery = `
            CREATE TABLE test_table2 (
                id INT AUTO_INCREMENT PRIMARY KEY,
                value VARCHAR(255)
            )
        `;
        connection.query(createTableQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                return;
            }
            console.log('Table created.');

            const insertQuery = 'INSERT INTO test_table2 (value) VALUES (?)';
            connection.query(insertQuery, ['Sample Value'], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err.stack);
                    return;
                }
                console.log(`Inserted row with ID: ${results.insertId}`);

                // Close the connection
                connection.end((err) => {
                    if (err) {
                        console.error('Error closing the connection:', err.stack);
                        return;
                    }
                    console.log('Connection closed.');
                });
            });
        });
    });
});