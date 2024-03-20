import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routers/productsRouter";
import usersRouter from "./routers/usersRouter";
import categoryRouter from "./routers/categoryRouter";
import orderRouter from "./routers/orderRouter";


const app = express();
app.use(express.json());
dotenv.config({ path: ".env" })

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter)

export default app
