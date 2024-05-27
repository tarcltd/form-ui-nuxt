<template>
  <div
    :class="{
      'fixed': true,
      'top-0': true,
      'right-0': true,
      'bottom-0': true,
      'left-0': true,
      'grid': true,
      'grid-cols-[1fr_auto]': true,
      'gap-4': true,
      'overflow-hidden': true,
    }"
  >
    <div class="overflow-hidden overflow-y-auto">
      {{ builderSchema }}
      <TForm v-bind="exampleForm" />
    </div>
    <div
      :class="{
        'grid': true,
        'w-[250px]': true,
        'p-4': true,
        'box-border': true,
        'h-full': true,
        'overflow-hidden': true,
        'overflow-y-auto': true,
      }"
    >
      <TFormBuilder v-model="builderSchema" />
    </div>
  </div>
</template>

<script lang="ts" setup>
const builderSchema = ref<ReturnType<typeof useForm>['input']>({})
const exampleForm = computed(() => useForm(builderSchema.value))
</script>
