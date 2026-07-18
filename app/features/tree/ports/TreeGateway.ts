import type { Collection } from "~/lib/hydra";
import type { Tree } from "../domain/tree";

export interface TreeGateway {
  getTrees(): Promise<Collection<Tree>>;
}
