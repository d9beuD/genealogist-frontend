type HydraMetadata = {
  "@context"?: string;
  "@id": string;
  "@type": string;
};

export type Item<T extends object> = HydraMetadata & T;

export type CollectionView = {
  "@id": string;
  "@type": string;
  first?: string;
  last?: string;
  previous?: string;
  next?: string;
};

export type CollectionSearch = {
  "@type": string;
  template: string;
  variableRepresentation: string;
  mapping: Array<Record<string, unknown>>;
};

export type Collection<T extends object> = {
  totalItems: number;
  search?: CollectionSearch;
  view?: CollectionView;
  member: Array<Item<T>>;
};
