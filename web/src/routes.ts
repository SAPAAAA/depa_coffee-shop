import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("./layouts/MainLayout/MainLayout.tsx", [
    index("./routes/Home/index.ts"),
  ]),
  layout("./layouts/AuthLayout/AuthLayout.tsx", [
    route("login", "./features/auth/pages/Login/Login.tsx"),
  ]),
] satisfies RouteConfig;
