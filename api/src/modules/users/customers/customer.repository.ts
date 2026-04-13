import type { Knex } from "knex";
import type { CreateCustomerDTO, UpdateCustomerDTO } from "./customer.model";
import db from "@/core/db/knex";
import camelcaseKeys from "camelcase-keys";

declare module "knex/types/tables" {
  interface Tables {
    customers: Knex.CompositeTableType<
      Record<string, any>,
      Record<string, any>,
      Record<string, any>
    >;
  }
}

class CustomerRepository {
  private readonly knex: Knex;

  constructor(knex: Knex) {
    this.knex = knex;
  }

  private conn(trx?: Knex | Knex.Transaction) {
    return trx || this.knex;
  }

  getByEmail = async (email: string, trx?: Knex | Knex.Transaction) => {
    const customer = await this.conn(trx)("customers").where({ email }).first();
    return customer ? camelcaseKeys(customer, { deep: true }) : null;
  };

  getById = async (id: string, trx?: Knex | Knex.Transaction) => {
    const customer = await this.conn(trx)("customers").where({ id }).first();
    return customer ? camelcaseKeys(customer, { deep: true }) : null;
  };

  getByUsername = async (username: string, trx?: Knex | Knex.Transaction) => {
    const customer = await this.conn(trx)("customers").where({ username }).first();
    return customer ? camelcaseKeys(customer, { deep: true }) : null;
  };

  create = async (customerData: CreateCustomerDTO, trx?: Knex | Knex.Transaction) => {
    const [customer] = await this.conn(trx)("customers")
      .insert(customerData)
      .returning("*");
    return customer ? camelcaseKeys(customer, { deep: true }) : null;
  };

  update = async (id: string, updateData: UpdateCustomerDTO, trx?: Knex | Knex.Transaction) => {
    const [customer] = await this.conn(trx)("customers")
      .where({ id })
      .update(updateData)
      .returning("*");
    return customer ? camelcaseKeys(customer, { deep: true }) : null;
  };
}

export type { CustomerRepository };
export default new CustomerRepository(db);