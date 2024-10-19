# Reproduce @opentelemetry/instrumentation-mysql2 error

This is a test project to reproduce encountered @opentelemetry/instrumentation-mysql2 errors.

## Running with released versions

```bash
docker run --rm -d --name otel-mysql -p 33306:3306 -e MYSQL_ROOT_PASSWORD=rootpw -e MYSQL_DATABASE=test_db -e MYSQL_USER=otel -e MYSQL_PASSWORD=secret mysql --log_output=TABLE --general_log=ON

npm i
# run the erroneous mode (mysql2)
npm start
# run the working mode (mysql2/promise)
npm run start:promise-based
```

## Checkout mysql2 into a local folder and provide the fixed version

```bash
cd <mysql2-local-folder>
git checkout fix/circular-dependencies
npm pack
cd <test-esm-mysql-otel-local-folder>
npm i <mysql2-local-folder>/mysql*.tgz
```

```bash
# run the callback mode (mysql2)
npm start
# run the working mode (mysql2/promise)
npm run start:promise-based
```
You will notice that the callback modee no longer crashes, but it will also not be instrumented.

Run `npm run start:callback-based-cjs` to see an instrumented cjs version though.

When used in esm, mysql2 seems to require the following further patch:

package.json (see lines with callback.js)
```
"files": [
    "lib",
    "typings/mysql",
    "index.js",
    "index.d.ts",
    "callback.js",
    "promise.js",
    "promise.d.ts"
  ],
  "exports": {
    ".": "./index.js",
    "./callback": "./callback.js",
    "./callback.js": "./callback.js",
    "./package.json": "./package.json",
    "./promise": "./promise.js",
    "./promise.js": "./promise.js"
  },
```

callback.js
```
'use strict';

module.exports = require('./index.js');
```

Only with this indirection will the instrumentation activate.

@opentelemetry iterates over modules and compares them to the module name specified by the instrumentation ('mysql2'). When this indirection is not there, there will only be sub modules checked against 'mysql2'. 'mysql2' is never encountered. This is not true for the promised based approach, because promise.js requires index.js indirectly by requiring lib/promise_connection.js and possibly others.

I think this is an error in @opentelemetry, but I need to investigate that.

Applying the above described callback.js patch shows that instrumentation for the mysql2 callback mode is possible and working for esm users.