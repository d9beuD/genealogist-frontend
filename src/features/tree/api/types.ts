export interface CreateTreeRequest {
  name: string
}

export interface TreeHydraResource {
  '@context'?: string
  '@id': string
  '@type': string
}

export interface CreatedTree extends TreeHydraResource {
  id: number
  name: string
  createdAt: string
}

export interface TreeCollectionView {
  '@id': string
  '@type': string
  first?: string
  last?: string
  previous?: string
  next?: string
}

export interface TreeCollectionSearchMapping {
  '@type': string
  variable: string
  property: string
  required: boolean
}

export interface TreeCollectionSearch {
  '@type': string
  template: string
  variableRepresentation: string
  mapping: TreeCollectionSearchMapping[]
}

export interface TreeCollectionResponse {
  totalItems: number
  member: CreatedTree[]
  search?: TreeCollectionSearch
  view?: TreeCollectionView
}

export interface ProblemDetails extends Partial<TreeHydraResource> {
  title?: string | null
  detail?: string | null
  status: number | null
  instance?: string | null
  type?: string
  description?: string
}

export interface ValidationViolation {
  propertyPath: string
  message: string
  code?: string
  hint?: string
  payload?: Record<string, unknown>
}

export interface ValidationProblemDetails extends ProblemDetails {
  status: 422
  violations?: ValidationViolation[]
}

export type CreateTreeErrorResponse = ProblemDetails | ValidationProblemDetails
