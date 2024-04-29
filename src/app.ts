import express from "express";
import passport from "passport";
import cors from "cors";
import dotenv from "dotenv";

import productsRouter from "./routers/productRouter";
import usersRouter from "./routers/userRouter";
import categoryRouter from "./routers/categoryRouter";
import cartItemRouter from "./routers/cartItemRouter";
import orderRouter from "./routers/orderRouter";
import errorHandler from "./middlewares/errorHandler";
import { googleStrategy, jwtStrategy } from "./config/passport";
import notFound from "./middlewares/notFoundError";
import { BadRequestError } from "./errors/ApiError";

const stripe = require("stripe")(process.env.STRIPE_SECRET);

const app = express();
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);
passport.use(googleStrategy);
app.use(express.static("public"));

dotenv.config({ path: ".env" });

// Add middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // Replace '*' with the specific origin you want to allow
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Todo: create-payment-intent
app.post("/api/v1/create-payment-intent", async (req, res, next) => {
  try {
    const { total, userId } = req.body;
    console.log(total, userId);

    if (!total || !userId) {
      throw new BadRequestError("UserId and total are missing.");
    }

    if (total <= 0.5) {
      throw new BadRequestError("Total should be greater than 0.5$.");
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: "usd",
      metadata: {
        userId: userId,
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(error);
  }
});

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/cartItems", cartItemRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1", usersRouter);

app.use(errorHandler);
app.use(notFound);

export default app;
