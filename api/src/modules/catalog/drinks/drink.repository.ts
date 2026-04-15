import type { Knex } from "knex";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import db from "@/core/db/knex";
import {
  type Drink,
  type CompleteDrink,
  type CreateDrinkDTO,
  type UpdateDrinkDTO,
  DrinkSchema,
  CompleteDrinkSchema,
  type MenuDrink,
  MenuDrinkSchema,
} from "./drink.model";

declare module "knex/types/tables" {
  interface Tables {
    drinks: Knex.CompositeTableType<
      Record<string, any>,
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >;
  }
}

class DrinkRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private conn(trx?: Knex | Knex.Transaction) {
    return trx || this.knex;
  }

  getAllDrinks = async (trx?: Knex | Knex.Transaction): Promise<Drink[]> => {
    const drinks = await this.conn(trx)("drinks").select("*");
    return drinks.map((drink) =>
      DrinkSchema.parse(camelcaseKeys(drink, { deep: true })),
    );
  };

  getAllDrinksBaseInfo = async (trx?: Knex | Knex.Transaction): Promise<MenuDrink[]> => {
    const connection = this.conn(trx);

    const drinks = await connection("drinks")
      .leftJoin("drink_variants", "drinks.id", "drink_variants.drink_id")
      .select(
        "drinks.id",
        "drinks.name",
        "drinks.description",
        "drinks.category_id",
        "drinks.image_url",
        "drink_variants.price",
        "drink_variants.volume_ml"
      )
      .where({ "drink_variants.is_default": true })
      .groupBy("drinks.id", "drink_variants.id");

    return drinks.map((drink) =>
      MenuDrinkSchema.parse(camelcaseKeys(drink, { deep: true })),
    );
  }

  getDrinkById = async (id: string, trx?: Knex | Knex.Transaction): Promise<Drink | null> => {
    const drink = await this.conn(trx)("drinks").where({ id }).first();
    if (!drink) {
      return null;
    }
    return DrinkSchema.parse(camelcaseKeys(drink, { deep: true }));
  };

  getCompleteDrinkInfoById = async (
    id: string,
    trx?: Knex | Knex.Transaction
  ): Promise<CompleteDrink | null> => {
    const connection = this.conn(trx);
    const drink = await connection("drinks")
      .first()
      .where({ "drinks.id": id })
      .select(
        "drinks.*",
        connection.raw("json_agg(drink_variants.*) as variants"),
        connection.raw(`
          json_build_object(
            'id', drink_categories.id, 
            'name', drink_categories.name, 
            'description', drink_categories.description
          ) AS category
        `),
      )
      .leftJoin("drink_variants", "drinks.id", "drink_variants.drink_id")
      .leftJoin("drink_categories", "drinks.category_id", "drink_categories.id")
      .groupBy("drinks.id", "drink_categories.id");

    if (!drink) {
      return null;
    }
    return CompleteDrinkSchema.parse(camelcaseKeys(drink, { deep: true }));
  };

  createDrink = async (data: CreateDrinkDTO, trx?: Knex | Knex.Transaction): Promise<Drink> => {
    const dbPayload = snakecaseKeys(data, { deep: true });
    const [newDrink] = await this.conn(trx)("drinks").insert(dbPayload).returning("*");
    return DrinkSchema.parse(camelcaseKeys(newDrink, { deep: true }));
  };

  updateDrink = async (
    id: string,
    data: UpdateDrinkDTO,
    trx?: Knex | Knex.Transaction
  ): Promise<Drink | null> => {
    const dbPayload = snakecaseKeys(data, { deep: true });
    const [updatedDrink] = await this.conn(trx)("drinks")
      .where({ id })
      .update(dbPayload)
      .returning("*");

    if (!updatedDrink) {
      return null;
    }
    return DrinkSchema.parse(camelcaseKeys(updatedDrink, { deep: true }));
  };

  deleteDrink = async (id: string, trx?: Knex | Knex.Transaction): Promise<void> => {
    await this.conn(trx)("drinks").where({ id }).delete();
  };
}

export type { DrinkRepository };
export default new DrinkRepository(db);