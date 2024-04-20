import express from "express";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";

import productsRouter from "./routers/productRouter";
import usersRouter from "./routers/userRouter";
import categoryRouter from "./routers/categoryRouter";
import orderRouter from "./routers/orderRouter";
import errorHandler from "./middlewares/errorHandler";
import { googleStrategy, jwtStrategy } from "./config/passport";
import notFound from "./middlewares/notFoundError";

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(googleStrategy);

dotenv.config({ path: ".env" });

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1", usersRouter);

app.use(errorHandler);
app.use(notFound);

export default app;
