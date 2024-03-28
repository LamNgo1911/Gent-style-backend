import express from "express";
import dotenv from "dotenv";
import productsRouter from "./routers/productsRouter";
import usersRouter from "./routers/usersRouter";
import categoryRouter from "./routers/categoryRouter";
import orderRouter from "./routers/orderRouter";
import errorHandler from "./middlewares/errorHandler";

import checkUserRole from './middlewares/checkUserRole';


const app = express();
app.use(express.json());
dotenv.config({ path: ".env" })

app.use("/api/v1/products", productsRouter);

app.use('/api/v1/:username/users', (req, res, next) => {
    const { username } = req.params;
    checkUserRole(username)(req, res, next);
}, usersRouter);

app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter)

app.use(errorHandler)

export default app
