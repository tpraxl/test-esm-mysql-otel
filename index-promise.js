import mysql from 'mysql2/promise';

console.log(mysql.format('INSERT INTO test_table2 (value) VALUES (?)', ['Sample Value']))
