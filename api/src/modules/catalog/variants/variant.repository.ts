import type { Knex } from "knex";
import camelcaseKeys from "camelcase-keys";
import snakecaseKeys from "snakecase-keys";
import db from "@/core/db/knex";
import {
  DrinkVariantSchema,
  type CreateDrinkVariantDTO,
  type DrinkVariant,
  type UpdateDrinkVariantDTO,
} from "./variant.model";

declare module "knex/types/tables" {
  interface Tables {
    drink_variants: Knex.CompositeTableType<
      DrinkVariant,
      Record<string, unknown>,
      Record<string, unknown>
    >;
  }
}

class DrinkVariantRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private conn(trx?: Knex | Knex.Transaction) {
    return trx || this.knex;
  }

  getAllVariants = async (trx?: Knex | Knex.Transaction): Promise<DrinkVariant[]> => {
    const variants = await this.conn(trx)("drink_variants").select("*");
    return variants.map((variant) =>
      DrinkVariantSchema.parse(camelcaseKeys(variant, { deep: true })),
    );
  };

  getById = async (id: string, trx?: Knex | Knex.Transaction): Promise<DrinkVariant | null> => {
    const variant = await this.conn(trx)("drink_variants").where({ id }).first();
    if (!variant) {
      return null;
    }
    return DrinkVariantSchema.parse(camelcaseKeys(variant, { deep: true }));
  };

  createVariant = async (
    data: CreateDrinkVariantDTO,
    trx?: Knex | Knex.Transaction
  ): Promise<DrinkVariant> => {
    const dbPayload = snakecaseKeys(data, { deep: true });
    const [newVariant] = await this.conn(trx)("drink_variants").insert(dbPayload).returning("*");
    return DrinkVariantSchema.parse(camelcaseKeys(newVariant, { deep: true }));
  };

  updateVariant = async (
    id: string,
    data: UpdateDrinkVariantDTO,
    trx?: Knex | Knex.Transaction
  ): Promise<DrinkVariant | null> => {
    const dbPayload = snakecaseKeys(data, { deep: true });
    const [updatedVariant] = await this.conn(trx)("drink_variants")
      .where({ id })
      .update(dbPayload)
      .returning("*");

    if (!updatedVariant) {
      return null;
    }
    return DrinkVariantSchema.parse(
      camelcaseKeys(updatedVariant, { deep: true }),
    );
  };

  deleteVariant = async (id: string, trx?: Knex | Knex.Transaction): Promise<void> => {
    await this.conn(trx)("drink_variants").where({ id }).delete();
  };

  getVariantsByDrinkId = async (drinkId: string, trx?: Knex | Knex.Transaction): Promise<DrinkVariant[]> => {
    const variants = await this.conn(trx)("drink_variants").where({ drink_id: drinkId }).select("*");
    return variants.map((variant) =>
      DrinkVariantSchema.parse(camelcaseKeys(variant, { deep: true })),
    );
  }
}

export type { DrinkVariantRepository };
export default new DrinkVariantRepository(db);