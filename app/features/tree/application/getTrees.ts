import type { Tree } from "../domain/tree";
import type { TreeGateway } from "../ports/TreeGateway";

export function getTrees(gateway: TreeGateway): Promise<Tree[]> {
  return gateway.getTrees();
}
