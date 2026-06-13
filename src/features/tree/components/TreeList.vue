<script setup lang="ts">
import TreeListItem from '@/features/tree/components/TreeListItem.vue'
import type { CreatedTree } from '@/features/tree/api/types'

defineProps<{
  trees: CreatedTree[]
}>()

const emit = defineEmits<{
  select: [treeId: number]
}>()
</script>

<template>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <TreeListItem
      v-for="tree in trees"
      :key="tree.id"
      :tree="tree"
      @click="emit('select', tree.id)"
    />
  </div>
</template>
