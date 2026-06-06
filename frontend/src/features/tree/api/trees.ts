import type { TreeCollection } from '@/interfaces/treecollection'
import { backend } from '@/api'

export async function fetchTrees(): Promise<TreeCollection[]> {
  return backend<TreeCollection[]>('/trees')
}
