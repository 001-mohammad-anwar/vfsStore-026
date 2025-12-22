require("dotenv").config();
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 8080;

const connectDb = require("./Utils/DataBase");

const routes = require("./router/auth-router");
const categoryRouter = require("./router/category-route");
const userRoute = require("./router/user-route");
const uploadRouter = require("./router/uploadImage-router");
const subCategoryRouter = require("./router/subCategory-route");
const productRouter = require("./router/product-route");
const cartRouter = require("./router/cartRouter");
const Addressrouter = require("./router/address.route");
const OrderRouter = require("./router/order-route");
const errorMiddleware = require("./Moddleware/error-middleware");

app.set("trust proxy", 1);

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", routes);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRouter);
app.use("/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/address", Addressrouter);
app.use("/api/order", OrderRouter);

app.use(errorMiddleware);

connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
