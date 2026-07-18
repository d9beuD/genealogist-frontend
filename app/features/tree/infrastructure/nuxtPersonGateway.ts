import type { Collection } from "~/lib/hydra";
import type { Person } from "../domain/person";
import type { PersonGateway } from "../ports/PersonGateway";

type NuxtFetch = typeof $fetch;

export function createNuxtPersonGateway(fetcher: NuxtFetch): PersonGateway {
  return {
    getPeople(treeId: number) {
      return fetcher<Collection<Person>>(`/api/trees/${treeId}/people`);
    },
  };
}
