import { NodeTracerProvider } from '@opentelemetry/node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { ConsoleSpanExporter } from '@opentelemetry/tracing';
import {diag, DiagConsoleLogger, DiagLogLevel} from "@opentelemetry/api";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.DEBUG);

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

registerInstrumentations({
    instrumentations: [
        new MySQL2Instrumentation({
            enhancedDatabaseReporting: true
        })
    ]
});

console.log("tracing started");