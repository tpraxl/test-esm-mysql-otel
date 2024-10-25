# Reproduce @opentelemetry/instrumentation-mysql2 error

This is a test project to reproduce encountered @opentelemetry/instrumentation-mysql2 errors.

TLDR;  
Use `--experimental-loader=@opentelemetry/instrumentation/hook.mjs` as is described here https://github.com/open-telemetry/opentelemetry-js/blob/main/doc/esm-support.md.
This will give you instrumentation for both, callback-based and promise-based variants of mysql.

## Running with released versions

```bash
docker run --rm -d --name otel-mysql -p 33306:3306 -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=test_db -e MYSQL_USER=otel -e MYSQL_PASSWORD=secret mysql --log_output=TABLE --general_log=ON

npm i
# run the erroneous mode (mysql2)
npm start:callback-based
# run the fixed mode (mysql)
npm run start:callback-based-fixed
# run the working mode (mysql2/promise)
npm run start:promise-based
# does not hurt to run it as it is intended:
npm run start:promise-based-fixed
```

## Checkout tpraxl/mysql2 into a local folder and provide the fixed version

```bash
git clone https://github.com/tpraxl/node-mysql2.git
cd <mysql2-local-folder>
git checkout fix/circular-dependencies-promise
npm pack
cd <test-esm-mysql-otel-local-folder>
npm i <mysql2-local-folder>/mysql*.tgz
```

```bash
# run the callback mode (mysql2)
npm start:callback-based
# run the callback mode with fixed start
npm start:callback-based-fixed
# run the working mode (mysql2/promise)
npm run start:promise-based
```
You will notice that the callback mode no longer crashes, but it will also not be instrumented.
Running `start:callback-based-fixed` will give you instrumentation. See https://github.com/open-telemetry/opentelemetry-js/blob/main/doc/esm-support.md.

Run `npm run start:callback-based-cjs` to see an instrumented cjs version.
