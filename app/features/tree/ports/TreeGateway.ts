import type { Tree } from "../domain/tree";

export interface TreeGateway {
  getTrees(): Promise<Tree[]>;
}
