import express, {
  type Application,
  type NextFunction,
  type Request,
  type Response,
} from "express";
import cookieParser from "cookie-parser";
import { AppError } from "./modules/shared/utils/errors";
import drinkRoute from "@/modules/catalog/drinks/drink.routes";
import orderRoute from "@/modules/sales/orders/order.routes";
import authRoute from "@/modules/auth/auth.routes";
import menuRoute from "@/modules/catalog/menu/menu.routes";
import cartRoute from "@/modules/sales/carts/cart.routes";
import drinkVariantRoute from "@/modules/catalog/variants/variant.routes";
import toppingRoute from "@/modules/catalog/toppings/topping.routes";
import corsMdw from "./modules/shared/middlewares/cors.mdw";

const apiPrefix = "/api/v1";
const baseRoute = express.Router();
const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(corsMdw);

app.use(apiPrefix, baseRoute);
baseRoute.use("/auth", authRoute);
baseRoute.use("/drinks", drinkRoute);
baseRoute.use("/orders", orderRoute);
baseRoute.use("/menu", menuRoute);
baseRoute.use("/carts", cartRoute);
baseRoute.use("/variants", drinkVariantRoute);
baseRoute.use("/toppings", toppingRoute);

baseRoute.get("/", (_req: Request, res: Response) => {
  res.send("Welcome to the Coffee Shop API!");
});

app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      code: err.code,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: "Internal Server Error",
  });
})



export default app;
