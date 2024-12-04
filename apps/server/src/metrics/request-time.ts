import client from "prom-client";

export const http_request_duration_milliseconds = new client.Histogram({
    name: 'http_request_duration_milliseconds',
    help: 'Duration of HTTP requests in milliseconds.',
    labelNames: ['method', 'route'],
    buckets: [1, 2, 3, 4, 5, 10, 25, 50, 100, 250, 500, 1000],
});