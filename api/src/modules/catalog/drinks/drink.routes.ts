import express from 'express';
import drinkController from './drink.controller';

const router = express.Router();

router.get('/', drinkController.getAllDrinks);
router.get('/:id', drinkController.getDrinkCompleteInfo);

export default router;