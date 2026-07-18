import type { Collection, Item } from "~/lib/hydra";
import type { CreateTreeInput, Tree } from "../domain/tree";

export interface TreeGateway {
  getTrees(): Promise<Collection<Tree>>;
  createTree(input: CreateTreeInput): Promise<Item<Tree>>;
}
