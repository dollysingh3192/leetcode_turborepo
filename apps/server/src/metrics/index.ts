import { NextFunction, Request, Response } from "express";
import { requestCounter } from "../metrics/request-count";
import { activeRequestsGauge } from "../metrics/active-requests";
import { http_request_duration_milliseconds } from "./request-time";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
    activeRequestsGauge.inc();
    // Start a timer for every request made
    res.locals.startEpoch = Date.now();

    res.on('finish', function() {
        // Increment request counter
        requestCounter.labels(req.method, req.originalUrl, res.statusCode.toString()).inc();

        const responseTimeInMilliseconds = Date.now() - res.locals.startEpoch;
        http_request_duration_milliseconds
            .labels(req.method, req.originalUrl)
            .observe(responseTimeInMilliseconds)

        activeRequestsGauge.dec();
    });

    next();
}