import type { Knex } from "knex";
import {
  ToppingSchema,
  type CreateToppingDTO,
  type Topping,
  type UpdateToppingDTO,
} from "./topping.model";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import db from "@/core/db/knex";

declare module "knex/types/tables" {
  interface Tables {
    toppings: Knex.CompositeTableType<
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >;
  }
}

class ToppingRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private conn(trx?: Knex | Knex.Transaction) {
    return trx || this.knex;
  }

  getAllToppings = async (trx?: Knex | Knex.Transaction): Promise<Topping[]> => {
    const toppings = await this.conn(trx)("toppings").select("*");
    return toppings.map((topping) =>
      ToppingSchema.parse(camelcaseKeys(topping, { deep: true })),
    );
  };

  getById = async (id: string, trx?: Knex | Knex.Transaction): Promise<Topping | null> => {
    const topping = await this.conn(trx)("toppings").where({ id }).first();
    if (!topping) {
      return null;
    }
    return ToppingSchema.parse(camelcaseKeys(topping, { deep: true }));
  };

  getToppingsByIds = async (ids: string[], trx?: Knex | Knex.Transaction): Promise<Topping[]> => {
    if (ids.length === 0) {
      return [];
    }
    const toppings = await this.conn(trx)("toppings").whereIn("id", ids).select("*");
    return toppings.map((topping) =>
      ToppingSchema.parse(camelcaseKeys(topping, { deep: true })),
    );
  };

  createTopping = async (data: CreateToppingDTO, trx?: Knex | Knex.Transaction): Promise<Topping> => {
    const dbPayload = snakecaseKeys(data, { deep: true });
    const [newTopping] = await this.conn(trx)("toppings").insert(dbPayload).returning("*");
    return ToppingSchema.parse(camelcaseKeys(newTopping, { deep: true }));
  };

  updateTopping = async (
    id: string,
    data: UpdateToppingDTO,
    trx?: Knex | Knex.Transaction
  ): Promise<Topping | null> => {
    const dbPayload = snakecaseKeys(data, { deep: true });
    const [updatedTopping] = await this.conn(trx)("toppings")
      .where({ id })
      .update(dbPayload)
      .returning("*");

    if (!updatedTopping) {
      return null;
    }
    return ToppingSchema.parse(camelcaseKeys(updatedTopping, { deep: true }));
  };

  deleteTopping = async (id: string, trx?: Knex | Knex.Transaction): Promise<void> => {
    await this.conn(trx)("toppings").where({ id }).delete();
  };
}

export type { ToppingRepository };
export default new ToppingRepository(db);