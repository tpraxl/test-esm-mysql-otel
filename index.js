// Instrumentation not working with resolved circular dependencies in mysql2:
import mysql from 'mysql2'
// Instrumentation would only work if we used
// import mysql from 'mysql2/callback';
// along with mysql2 providing the proper export "./callback": "./callback.js"
// and with mysql2 callback.js having module.exports = require('./index.js');
// It seems to be necessary to have a file requiring the file that represents the main module.
// Otherwise, the instrumentation is not activated.
// @see index.cjs and index-promise.js for working versions.

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
    const dropTableQuery = `DROP TABLE IF EXISTS test_table2`;
    connection.execute(dropTableQuery, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return;
        }
        const createTableQuery = `
            CREATE TABLE test_table2 (
                id INT AUTO_INCREMENT PRIMARY KEY,
                value VARCHAR(255)
            )
        `;
        connection.execute(createTableQuery, (err, results) => {
            if (err) {
                console.error('Error executing query:', err.stack);
                return;
            }
            const insertQuery = 'INSERT INTO test_table2 (value) VALUES (?)';
            connection.execute(insertQuery, ['Sample Value'], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err.stack);
                    return;
                }
                connection.query('SELECT * FROM test_table2', (err, results) => {
                    if(err) {
                        console.error('Error querying', err.stack)
                        return;
                    }
                })
                // Close the connection
                connection.end((err) => {
                    if (err) {
                        console.error('Error closing the connection:', err.stack);
                        return;
                    }
                });
            });
        });
    });
});