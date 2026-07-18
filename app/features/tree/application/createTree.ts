import type { CreateTreeInput, Tree } from "../domain/tree";
import type { TreeGateway } from "../ports/TreeGateway";

export async function createTree(
  gateway: TreeGateway,
  input: CreateTreeInput,
): Promise<Tree> {
  return await gateway.createTree(input);
}
