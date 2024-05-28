<template>
  <Draggable
    v-model="sortedFields"
    group="fields"
    handle=".drag-handle"
    animation="150"
    ,
    item-key="name"
    class="flex flex-col w-full"
    @start="drag = true"
    @end="drag = false"
  >
    <template #item="{ element }">
      <div
        :key="element[0]"
        :class="{
          'grid': true,
          'gap-4': true,
          'p-2': true,
          'pt-4': true,
          'border': true,
          'border-solid': true,
          'border-gray-300': true,
          'dark:border-gray-700': true,
          'bg-white': true,
          'dark:bg-gray-900': true,
          'rounded-md': true,
        }"
      >
        <UIcon
          name="i-ph-dots-six-vertical"
          class="drag-handle text-gray-300 dark:text-gray-700 cursor-pointer"
        />
        <TFormField
          v-model="stubModel"
          :field-key="element[0]"
          :field="element[1]"
          :input="internalValue"
          disabled
        />
      </div>
    </template>
  </Draggable>
</template>

<script lang="ts" setup>
import Draggable from 'vuedraggable'
import type useForm from '@tarcltd/form-vue'
import { computed, ref, watch } from 'vue'
import type { SchemaField } from '@tarcltd/form-vue'
import TFormField from './TFormField.vue'

const props = defineProps<{
  modelValue: ReturnType<typeof useForm>['input']
}>()
const emit = defineEmits(['update:modelValue'])
const internalValue = computed({
  get: () => props.modelValue,
  set(value) {
    emit('update:modelValue', value)
  },
})
const sortedFields = ref<[string, SchemaField][]>([])
const drag = ref(false)
const stubModel = ref('')

watch(
  internalValue,
  (value) => {
    sortedFields.value = Object.entries(value?.properties ?? {}).sort(
      ([_, a], [__, b]) => a.attrs?.order - b.attrs?.order,
    )
  },
  { immediate: true, deep: true },
)

watch(drag, (value) => {
  if (value) {
    return
  }

  const newProperties: Record<string, SchemaField> = {}

  for (const [index, [key, field]] of sortedFields.value.entries()) {
    newProperties[key] = {
      ...field,
      attrs: {
        ...field.attrs,
        order: index + 1,
      },
    }
  }

  internalValue.value.properties = newProperties
})
</script>
