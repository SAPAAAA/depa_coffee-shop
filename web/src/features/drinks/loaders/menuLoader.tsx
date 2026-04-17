import { getMenu } from "@/services/menu";
import type { Route } from "./+types/menuLoader";

export const menuLoader = async ({ params }: Route.LoaderArgs) => {
  const menu = await getMenu();
  return { menu };
};


export default menuLoader;