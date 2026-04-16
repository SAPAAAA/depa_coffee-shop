import express from "express";
import toppingController from "./topping.controller";

const route = express.Router();

route.get("/", toppingController.getAllToppings);
route.get("/:id", toppingController.getToppingById);

export default route;