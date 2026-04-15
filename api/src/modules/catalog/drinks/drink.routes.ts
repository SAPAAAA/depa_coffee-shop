import express from 'express';
import drinkController from './drink.controller';

const route = express.Router();

route.get('/', drinkController.getAllDrinks);
route.get('/:id', drinkController.getDrink);
route.get('/:id/complete', drinkController.getDrinkCompleteInfo);

export default route;