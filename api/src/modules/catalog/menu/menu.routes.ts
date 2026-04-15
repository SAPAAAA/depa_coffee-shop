import express from "express";
import menuController from "./menu.controller";

const route = express.Router();

route.get("/", menuController.getMenu);

export default route;