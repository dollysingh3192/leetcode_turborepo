import express from "express";
import cors from "cors";
import router from "./routes/index";
import promBundle from "express-prom-bundle";

const metricsMiddleware = promBundle({ 
    includeMethod: true, 
    includePath: true, 
    promClient: {
        collectDefaultMetrics: {

        }
  }, });

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use(metricsMiddleware);
app.use("/api", router);

app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
});
