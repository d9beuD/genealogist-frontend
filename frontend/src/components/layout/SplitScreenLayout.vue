<script setup lang="ts">
import type { HTMLAttributes } from 'vue'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SplitScreenLayoutProps = {
  class?: HTMLAttributes['class']
  cardClass?: HTMLAttributes['class']
  contentClass?: HTMLAttributes['class']
  asideClass?: HTMLAttributes['class']
  showAsideOnMobile?: boolean
}

const props = withDefaults(defineProps<SplitScreenLayoutProps>(), {
  showAsideOnMobile: false,
})
</script>

<template>
  <main :class="cn('bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10', props.class)">
    <div class="w-full max-w-sm md:max-w-4xl">
      <Card :class="cn('overflow-hidden p-0', props.cardClass)">
        <CardContent class="grid p-0 md:grid-cols-2">
          <div :class="cn('bg-card p-6 md:p-8', props.contentClass)">
            <slot />
          </div>

          <aside :class="cn(showAsideOnMobile ? 'block' : 'hidden md:block', props.asideClass)">
            <slot name="aside" />
          </aside>
        </CardContent>
      </Card>
    </div>
  </main>
</template>
