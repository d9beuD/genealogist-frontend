<script setup lang="ts">
import type { HTMLAttributes } from "vue"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type CenteredCardLayoutProps = {
  class?: HTMLAttributes["class"]
  cardClass?: HTMLAttributes["class"]
  contentClass?: HTMLAttributes["class"]
  asideClass?: HTMLAttributes["class"]
  showAsideOnMobile?: boolean
}

const props = withDefaults(defineProps<CenteredCardLayoutProps>(), {
  showAsideOnMobile: false,
})
</script>

<template>
  <main :class="cn('bg-muted relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10', props.class)">
    <div class="bg-muted-foreground/20 absolute inset-0" />

    <div class="relative w-full max-w-sm md:max-w-4xl">
      <div class="mb-2">
        <slot name="header" />
      </div>

      <Card :class="cn('overflow-hidden p-0 md:min-h-140', props.cardClass)">
        <CardContent class="grid flex-1 md:grid-cols-2">
          <div :class="cn('bg-card min-h-full flex flex-col justify-center p-6 md:p-8', props.contentClass)">
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
