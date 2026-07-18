import type { Tree } from "../domain/tree";
import type { TreeGateway } from "../ports/TreeGateway";

export async function getTrees(gateway: TreeGateway): Promise<Tree[]> {
  const collection = await gateway.getTrees();

  return collection.member;
}
