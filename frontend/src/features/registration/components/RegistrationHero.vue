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
  <div class="bg-muted relative flex h-full min-h-[520px] items-center justify-center overflow-hidden p-8 dark:brightness-[0.95] dark:grayscale">
    <div class="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-rose-950/30" />
    <div class="absolute inset-0 overflow-hidden">
      <svg
        class="absolute inset-0 h-full w-full text-amber-100/60 dark:text-amber-900/20"
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
        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-200/80 dark:bg-amber-800/50">
          <TreePine class="w-5 h-5 text-amber-700 dark:text-amber-300" />
        </div>
        <h1 class="text-2xl font-bold text-amber-900 dark:text-amber-100">
          {{ messages.title }}
        </h1>
      </div>

      <p class="text-base text-amber-800/80 dark:text-amber-200/70 leading-relaxed">
        {{ messages.subtitle }}
      </p>

      <div class="flex flex-col gap-3 mt-2">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/70 dark:bg-amber-900/40 shadow-sm">
            <Users class="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span class="text-sm text-amber-800/90 dark:text-amber-200/80">
            {{ messages.features[0] }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/70 dark:bg-amber-900/40 shadow-sm">
            <BookOpen class="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span class="text-sm text-amber-800/90 dark:text-amber-200/80">
            {{ messages.features[1] }}
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-white/70 dark:bg-amber-900/40 shadow-sm">
            <TreePine class="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <span class="text-sm text-amber-800/90 dark:text-amber-200/80">
            {{ messages.features[2] }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
