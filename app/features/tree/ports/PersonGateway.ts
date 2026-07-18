import type { Collection } from "~/lib/hydra";
import type { Person } from "../domain/person";

export interface PersonGateway {
  getPeople(treeId: number): Promise<Collection<Person>>;
}
