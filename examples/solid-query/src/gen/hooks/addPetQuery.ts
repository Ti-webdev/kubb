import client from '@kubb/swagger-client/client'
import { createMutation } from '@tanstack/solid-query'
import type { AddPetMutationRequest, AddPetMutationResponse, AddPet405 } from '../models/AddPet'
import type { CreateMutationOptions, CreateMutationResult } from '@tanstack/solid-query'

type AddPetClient = typeof client<AddPetMutationResponse, AddPet405, AddPetMutationRequest>
type AddPet = {
  data: AddPetMutationResponse
  error: AddPet405
  request: AddPetMutationRequest
  pathParams: never
  queryParams: never
  headerParams: never
  response: Awaited<ReturnType<AddPetClient>>['data']
  unionResponse: Awaited<ReturnType<AddPetClient>> | Awaited<ReturnType<AddPetClient>>['data']
  client: {
    paramaters: Partial<Parameters<AddPetClient>[0]>
    return: Awaited<ReturnType<AddPetClient>>
  }
}
/**
 * @description Add a new pet to the store
 * @summary Add a new pet to the store
 * @link /pet */
export function addPetQuery<TData = AddPet['response'], TError = AddPet['error']>(
  options: {
    mutation?: CreateMutationOptions<TData, TError, AddPet['request']>
    client?: AddPet['client']['paramaters']
  } = {},
): CreateMutationResult<TData, TError, AddPet['request']> {
  const { mutation: mutationOptions, client: clientOptions = {} } = options ?? {}
  return createMutation<TData, TError, AddPet['request']>({
    mutationFn: (data) => {
      return client<AddPet['data'], TError, AddPet['request']>({
        method: 'post',
        url: `/pet`,
        data,
        ...clientOptions,
      }).then((res) => res as TData)
    },
    ...mutationOptions,
  })
}
