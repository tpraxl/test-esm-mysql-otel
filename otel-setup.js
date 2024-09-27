import { NodeTracerProvider } from '@opentelemetry/node';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { MySQL2Instrumentation } from '@opentelemetry/instrumentation-mysql2';
import { SimpleSpanProcessor } from '@opentelemetry/tracing';
import { ConsoleSpanExporter } from '@opentelemetry/tracing';

const provider = new NodeTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
provider.register();

registerInstrumentations({
    instrumentations: [
        new MySQL2Instrumentation()
    ]
});

console.log("tracing started");