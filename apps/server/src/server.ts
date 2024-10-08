import express from "express";
import cors from "cors";
import router from "./routes/index";

const app: express.Application = express();
const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
    console.log(`server listening at port: ${port}`);
});
