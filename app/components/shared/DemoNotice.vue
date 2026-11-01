<script setup lang="ts">
// Shown on every page load until the data layer is live and licensed.
const { t } = useI18n();
const open = ref(false);

onMounted(() => {
	open.value = true;
});
</script>

<template>
  <Dialog v-model:open="open">
    <DialogContent class="max-w-md">
      <DialogHeader>
        <span
          class="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400"
        >
          <span class="h-2 w-2 rounded-full bg-amber-500" />
          {{ t("demoNotice.badge") }}
        </span>
        <DialogTitle class="text-xl">{{ t("demoNotice.title") }}</DialogTitle>
        <DialogDescription class="space-y-2 pt-1 text-sm leading-relaxed">
          <span class="block">{{ t("demoNotice.body") }}</span>
          <span class="block font-medium text-foreground">{{ t("demoNotice.warning") }}</span>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button class="w-full sm:w-auto" @click="open = false">{{ t("demoNotice.cta") }}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
