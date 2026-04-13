import type { Knex } from "knex";
import type { CreateStaffDTO, UpdateStaffDTO } from "./staff.model";
import db from "@/core/db/knex";

class StaffRepository {
  private readonly knex: Knex;
  private readonly staff = () => this.knex("staff");

  constructor(knex: Knex) {
    this.knex = knex;
  }

  getByEmail = async (email: string) => {
    const staff = await this.staff().where({ email }).first();
    return staff || null;
  };

  getById = async (id: string) => {
    const staff = await this.staff().where({ id }).first();
    return staff || null;
  };

  getByUsername = async (username: string) => {
    const staff = await this.staff().where({ username }).first();
    return staff || null;
  };

  create = async (staffData: CreateStaffDTO) => {
    const [staff] = await this.staff()
      .insert(staffData)
      .returning("*");
    return staff;
  };

  update = async (id: string, updateData: UpdateStaffDTO) => {
    const [staff] = await this.staff()
      .where({ id })
      .update(updateData)
      .returning("*");
    return staff || null;
  };
}

export type { StaffRepository };
export default new StaffRepository(db);