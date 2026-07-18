import type { Person } from "../domain/person";
import type { PersonGateway } from "../ports/PersonGateway";

export async function getPeople(
  gateway: PersonGateway,
  treeId: number,
): Promise<Person[]> {
  const collection = await gateway.getPeople(treeId);

  return collection.member.map(
    ({
      id,
      firstname,
      lastname,
      birth,
      death,
      birthDayUnsure,
      birthMonthUnsure,
      birthYearUnsure,
      deathDayUnsure,
      deathMonthUnsure,
      deathYearUnsure,
      portrait,
      bio,
      gender,
      dead,
      birthName,
      otherNames,
      birthPlace,
      deathPlace,
    }) => ({
      id,
      firstname,
      lastname,
      birth,
      death,
      birthDayUnsure,
      birthMonthUnsure,
      birthYearUnsure,
      deathDayUnsure,
      deathMonthUnsure,
      deathYearUnsure,
      portrait,
      bio,
      gender,
      dead,
      birthName,
      otherNames,
      birthPlace,
      deathPlace,
    }),
  );
}
