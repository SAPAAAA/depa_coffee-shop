import type { Knex } from "knex";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import db from "@/core/db/knex";
import {
  DrinkCategorySchema,
  type CreateDrinkCategoryDTO,
  type DrinkCategory,
  type UpdateDrinkCategoryDTO,
} from "./category.model";

declare module "knex/types/tables" {
  interface Tables {
    categories: Knex.CompositeTableType<
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >;
  }
}

class CategoryRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private conn(trx?: Knex | Knex.Transaction) {
    return trx || this.knex;
  }

  getAll = async (trx?: Knex | Knex.Transaction): Promise<DrinkCategory[]> => {
    const categories = await this.conn(trx)("drink_categories").select("*");
    return categories.map((category) =>
      DrinkCategorySchema.parse(camelcaseKeys(category, { deep: true }))
    );
  };

  getById = async (id: string, trx?: Knex | Knex.Transaction): Promise<DrinkCategory | null> => {
    const category = await this.conn(trx)("drink_categories").where({ id }).first();
    if (!category) {
      return null;
    }
    return DrinkCategorySchema.parse(camelcaseKeys(category, { deep: true }));
  };

  create = async (
    data: CreateDrinkCategoryDTO,
    trx?: Knex | Knex.Transaction
  ): Promise<DrinkCategory> => {
    const dbPayload = snakecaseKeys(data, { deep: true });
    const [newCategory] = await this.conn(trx)("drink_categories").insert(dbPayload).returning("*");
    return DrinkCategorySchema.parse(camelcaseKeys(newCategory, { deep: true }));
  };

  update = async (
    id: string,
    data: UpdateDrinkCategoryDTO,
    trx?: Knex | Knex.Transaction
  ): Promise<DrinkCategory | null> => {
    const dbPayload = snakecaseKeys(data, { deep: true });
    const [updatedCategory] = await this.conn(trx)("drink_categories")
      .where({ id })
      .update(dbPayload)
      .returning("*");
    
    if (!updatedCategory) {
      return null;
    }
    return DrinkCategorySchema.parse(camelcaseKeys(updatedCategory, { deep: true }));
  };

  delete = async (id: string, trx?: Knex | Knex.Transaction): Promise<void> => {
    await this.conn(trx)("drink_categories").where({ id }).delete();
  };
}

export type { CategoryRepository };
export default new CategoryRepository(db);