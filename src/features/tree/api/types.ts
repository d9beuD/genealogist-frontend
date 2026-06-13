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
