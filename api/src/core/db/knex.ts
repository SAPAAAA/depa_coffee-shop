import knex, { type Knex } from "knex";
import config from "@/core/config/env";

class PgManager {
  private static instance: PgManager;
  private readonly knex: Knex;

  private constructor() {
    this.knex = knex({
      client: "pg",
      connection: {
        host: config.db.host,
        port: config.db.port,
        user: config.db.user,
        password: config.db.password,
        database: config.db.name,
      },
      pool: {
        min: 2,
        max: 10,
      },
    });
  }

  public static getInstance(): PgManager {
    if (!PgManager.instance) {
      PgManager.instance = new PgManager();
    }
    return PgManager.instance;
  }

  public getKnex() {
    return this.knex;
  }
}

export default PgManager.getInstance().getKnex();
