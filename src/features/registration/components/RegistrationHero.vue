<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Users, TreePine, BookOpen } from '@lucide/vue'

const { t } = useI18n()

const messages = computed(() => ({
  title: t('registration.hero.title', 'Your Family Story Starts Here'),
  subtitle: t('registration.hero.subtitle', 'Join thousands of people discovering their heritage'),
  features: [
    t('registration.hero.feature1', 'Build your family tree'),
    t('registration.hero.feature2', 'Connect with relatives'),
    t('registration.hero.feature3', 'Preserve your heritage'),
  ],
}))
</script>

<template>
  <div class="bg-muted relative flex h-full min-h-[32rem] items-center justify-center overflow-hidden p-8">
    <div class="absolute inset-0 bg-gradient-to-br from-muted via-background to-muted" />
    <div class="absolute inset-0 overflow-hidden">
      <svg
        class="text-border/60 absolute inset-0 h-full w-full dark:text-border/20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="currentColor"
              stroke-width="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
      </svg>
    </div>

    <div class="relative z-10 flex w-full max-w-md flex-col gap-6">
      <div class="flex items-center gap-3">
        <div class="bg-background/80 flex aspect-square h-16 items-center justify-center rounded-lg border shadow-sm">
          <TreePine class="text-primary h-8 w-8 shrink-0" />
        </div>
        <h1 class="text-foreground text-2xl font-bold">
          {{ messages.title }}
        </h1>
      </div>

      <p class="text-muted-foreground text-base leading-relaxed">
        {{ messages.subtitle }}
      </p>

      <div class="flex flex-col gap-3 mt-2">
        <div class="flex items-center gap-3">
          <div class="bg-background/70 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm">
            <Users class="text-primary h-4 w-4" />
          </div>
          <span class="text-muted-foreground text-sm">
            {{ messages.features[0] }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-background/70 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm">
            <BookOpen class="text-primary h-4 w-4" />
          </div>
          <span class="text-muted-foreground text-sm">
            {{ messages.features[1] }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="bg-background/70 flex h-8 w-8 items-center justify-center rounded-full border shadow-sm">
            <TreePine class="text-primary h-4 w-4" />
          </div>
          <span class="text-muted-foreground text-sm">
            {{ messages.features[2] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
