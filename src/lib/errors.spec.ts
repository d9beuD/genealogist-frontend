import { describe, expect, it } from 'vitest'

import { toAppError } from '@/lib/errors'

describe('toAppError', () => {
  it('maps 400 invalid input responses to validation errors', () => {
    const appError = toAppError(Object.assign(new Error('Bad Request'), {
      data: {
        '@context': '/api/contexts/Error',
        '@id': '/api/errors/400',
        '@type': 'Error',
        title: 'Invalid input',
        detail: 'The name field is invalid.',
        status: 400,
        instance: '/api/trees',
        type: '/errors/invalid-input',
        description: 'Validation failed.',
      },
      response: { status: 400 },
    }))

    expect(appError.code).toBe('VALIDATION')
    expect(appError.status).toBe(400)
    expect(appError.message).toBe('The name field is invalid.')
  })

  it('maps 403 forbidden responses to forbidden errors', () => {
    const appError = toAppError(Object.assign(new Error('Forbidden'), {
      data: {
        '@context': '/api/contexts/Error',
        '@id': '/api/errors/403',
        '@type': 'Error',
        title: 'Forbidden',
        detail: 'You are not allowed to create a tree.',
        status: 403,
        instance: '/api/trees',
        type: '/errors/forbidden',
        description: 'Access denied.',
      },
      response: { status: 403 },
    }))

    expect(appError.code).toBe('FORBIDDEN')
    expect(appError.status).toBe(403)
    expect(appError.message).toBe('You are not allowed to create a tree.')
  })

  it('extracts field errors from 422 constraint violations', () => {
    const appError = toAppError(Object.assign(new Error('Unprocessable Entity'), {
      data: {
        '@context': '/api/contexts/ConstraintViolation',
        '@id': '/api/validation_errors/42',
        '@type': 'ConstraintViolation',
        status: 422,
        detail: 'name: This value should not be blank.',
        description: 'Validation failed.',
        type: '/errors/validation',
        title: 'An error occurred',
        instance: '/api/trees',
        violations: [
          {
            propertyPath: 'name',
            message: 'This value should not be blank.',
            code: 'c1051bb4-d103-4f74-8988-acbcafc7fdc3',
            hint: 'Provide a tree name.',
            payload: {
              additionalProp1: {},
            },
          },
        ],
      },
      response: { status: 422 },
    }))

    expect(appError.code).toBe('VALIDATION')
    expect(appError.status).toBe(422)
    expect(appError.message).toBe('name: This value should not be blank.')
    expect(appError.fields).toEqual({
      name: 'This value should not be blank.',
    })
  })
})
