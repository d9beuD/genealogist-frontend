<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";
import { z } from "zod";
import type { CreateTreeInput } from "../../domain/tree";
import { CreateTreeAlreadyPendingError } from "../composables/useTrees";

const props = defineProps<{
  createTree: (input: CreateTreeInput) => Promise<unknown>;
  pending?: boolean;
}>();

const emit = defineEmits<{
  created: [];
}>();

const { t } = useI18n();
const open = ref(false);
const serverError = ref(false);
const localPending = ref(false);

const form = useForm<CreateTreeInput>({
  validationSchema: toTypedSchema(z.object({
    name: z.string().trim().min(1, t("trees.createNameRequired")),
  })),
  initialValues: {
    name: "",
  },
});

watch(open, (isOpen) => {
  if (!isOpen) {
    serverError.value = false;
    form.resetForm();
  }
});

const onSubmit = form.handleSubmit(async (values) => {
  if (localPending.value || props.pending) {
    return;
  }

  serverError.value = false;
  localPending.value = true;

  try {
    await props.createTree({ name: values.name.trim() });
    open.value = false;
    form.resetForm();
    emit("created");
  } catch (error) {
    if (error instanceof CreateTreeAlreadyPendingError) {
      return;
    }

    serverError.value = true;
  } finally {
    localPending.value = false;
  }
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogTrigger as-child>
      <slot />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{{ t("trees.createTitle") }}</DialogTitle>
        <DialogDescription>
          {{ t("trees.createDescription") }}
        </DialogDescription>
      </DialogHeader>

      <form class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>{{ t("trees.createNameLabel") }}</FormLabel>
            <FormControl>
              <Input
                v-bind="componentField"
                autocomplete="off"
                :placeholder="t('trees.createNamePlaceholder')"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <p v-if="serverError" class="text-destructive text-sm" role="alert">
          {{ t("trees.createError") }}
        </p>

        <DialogFooter>
          <Button type="submit" :disabled="pending || localPending || undefined">
            {{ pending || localPending ? t("trees.createSubmitPending") : t("trees.createSubmit") }}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
