import express from "express";
import drinkVariantController from "./variant.controller";

const route = express.Router();

route.get("/:id", drinkVariantController.getDrinkVariant);

export default route;