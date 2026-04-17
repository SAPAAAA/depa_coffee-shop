import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  // Customer routes
  layout("./layouts/MainLayout/index.ts", [
    index("./routes/Home/index.ts"),
    route("menu/*", "./features/drinks/pages/Menu/index.ts"),
    layout("./layouts/CustomerLayout/index.ts", [
      route("checkout", "./features/orders/pages/Checkout/index.ts"),
      route(
        "orders/confirmation/:orderId",
        "./features/orders/pages/Confirmation/index.ts",
      ),
    ]),
  ]),

  // Barista routes
  layout("./layouts/BaristaLayout/index.ts", [
    route("barista", "./features/orders/pages/BaristaBoard/index.ts"),
  ]),

  // Authentication routes
  layout("./layouts/AuthLayout/index.ts", [
    route("login", "./features/auth/pages/Login/index.ts"),
  ]),
] satisfies RouteConfig;
