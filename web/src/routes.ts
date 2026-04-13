import {
  type RouteConfig,
  index,
  layout,
  route
} from '@react-router/dev/routes'


export default [ 
  layout(
    "./layouts/MainLayout/MainLayout.tsx",
    [
      index("./routes/Home.tsx"),
    ]
  ),
] satisfies RouteConfig