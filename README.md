# Reproduce @opentelemetry/instrumentation-mysql2 error

This is a test project to reproduce encountered @opentelemetry/instrumentation-mysql2 errors.

```bash
docker run --rm -d --name otel-mysql -p 33306:3306 -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=test_db -e MYSQL_USER=otel -e MYSQL_PASSWORD=secret mysql --log_output=TABLE --general_log=ON

npm i
# run the erroneous mode (mysql2)
npm start
# run the working mode (mysql2/promise)
npm run start:promise-based
```
