<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import CenteredCardLayout from "~/components/layout/CenteredCardLayout.vue";
import { registerWithCredentials } from "../api/register";

const { t } = useI18n();
const router = useRouter();

const schema = toTypedSchema(
  z.object({
    email: z.string().min(1, t("register.emailRequired")).email(t("register.emailInvalid")),
    firstname: z.string().min(1, t("register.firstnameRequired")),
    lastname: z.string().min(1, t("register.lastnameRequired")),
    plainPassword: z.string().min(8, t("register.passwordMin")),
  }),
);

const form = useForm({
  validationSchema: schema,
  initialValues: {
    email: "",
    firstname: "",
    lastname: "",
    plainPassword: "",
  },
});

const mutation = useMutation({
  mutationFn: registerWithCredentials,
  onSuccess: async () => {
    await router.push("/login");
  },
});

const onSubmit = form.handleSubmit(async (values) => {
  await mutation.mutateAsync(values);
});
</script>

<template>
  <CenteredCardLayout
    card-class="border-border/60 shadow-xl"
    content-class="gap-6"
    aside-class="bg-primary text-primary-foreground hidden md:flex md:flex-col md:justify-between"
  >
    <template #header>
      <Tabs value="register">
        <TabsList class="grid w-fit grid-cols-2">
          <TabsTrigger value="login" as-child>
            <NuxtLinkLocale to="/login">
              {{ t("auth.login") }}
            </NuxtLinkLocale>
          </TabsTrigger>
          <TabsTrigger value="register">
            {{ t("auth.register") }}
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </template>

    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        {{ t("register.heading") }}
      </h1>
      <p class="text-muted-foreground text-sm leading-6">
        {{ t("register.description") }}
      </p>
    </div>

    <form class="space-y-4" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="firstname">
        <FormItem>
          <FormLabel>{{ t("register.firstnameLabel") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" autocomplete="given-name" :placeholder="t('register.firstnamePlaceholder')" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="lastname">
        <FormItem>
          <FormLabel>{{ t("register.lastnameLabel") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" autocomplete="family-name" :placeholder="t('register.lastnamePlaceholder')" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="email">
        <FormItem>
          <FormLabel>{{ t("register.emailLabel") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="email" autocomplete="email" :placeholder="t('register.emailPlaceholder')" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ componentField }" name="plainPassword">
        <FormItem>
          <FormLabel>{{ t("register.passwordLabel") }}</FormLabel>
          <FormControl>
            <Input v-bind="componentField" type="password" autocomplete="new-password" :placeholder="t('register.passwordPlaceholder')" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <p v-if="mutation.isError" class="text-destructive text-sm">
        {{ t("register.error") }}
      </p>

      <Button class="w-full" type="submit" :disabled="mutation.isPending">
        {{ mutation.isPending ? t("register.submitPending") : t("register.submit") }}
      </Button>
    </form>

    <p class="text-muted-foreground text-sm leading-6">
      {{ t("register.alreadyHaveAccount") }}
      <NuxtLinkLocale class="text-primary font-medium hover:underline" to="/login">
        {{ t("register.signIn") }}
      </NuxtLinkLocale>
    </p>

    <template #aside>
      <div class="flex h-full flex-col gap-6 rounded-xl bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] p-8">
        <div class="space-y-3">
          <p class="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
            {{ t("register.asideEyebrow") }}
          </p>
          <h2 class="text-3xl font-semibold leading-tight">
            {{ t("register.asideHeading") }}
          </h2>
        </div>

        <div class="mt-auto grid gap-3 text-sm text-white/80">
          <div class="rounded-lg border border-white/15 bg-white/10 p-4">
            {{ t("register.asideSecurity") }}
          </div>
          <div class="rounded-lg border border-white/15 bg-white/10 p-4">
            {{ t("register.asideQuickAccess") }}
          </div>
        </div>
      </div>
    </template>
  </CenteredCardLayout>
</template>
