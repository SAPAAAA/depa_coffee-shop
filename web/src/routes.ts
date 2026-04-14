import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/MainLayout/index.ts", [
    index("./routes/Home/index.ts"),
  ]),
  layout("./layouts/AuthLayout/index.ts", [
    route("login", "./features/auth/pages/Login/index.ts"),
  ]),
] satisfies RouteConfig;
