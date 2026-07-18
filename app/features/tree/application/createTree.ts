import type { CreateTreeInput, Tree } from "../domain/tree";
import type { TreeGateway } from "../ports/TreeGateway";

export async function createTree(
  gateway: TreeGateway,
  input: CreateTreeInput,
): Promise<Tree> {
  const result = await gateway.createTree(input);

  return { id: result.id, name: result.name, createdAt: result.createdAt };
}
