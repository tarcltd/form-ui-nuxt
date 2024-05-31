<template>
  <UCheckbox
    v-if="field.attrs?.['field:type'] === 'Checkbox'"
    v-model="internalValue"
    :label="
      input.required.includes(fieldKey)
        ? field.name
        : `${field.name} (Optional)`
    "
    v-bind="field.attrs?.elementFormGroup"
    :disabled="disabled"
  />
  <URadioGroup
    v-else-if="field.attrs?.['field:type'] === 'Radio'"
    v-model="internalValue"
    :legend="
      input.required.includes(fieldKey)
        ? field.name
        : `${field.name} (Optional)`
    "
    :options="field.enum?.map((e: string) => ({ label: e, value: e }))"
    v-bind="field.attrs?.elementFormGroup"
    :disabled="disabled"
  />
  <UFormGroup
    v-else
    :name="fieldKey"
    :label="
      input.required.includes(fieldKey)
        ? field.name
        : `${field.name} (Optional)`
    "
    :help="field.attrs?.help"
    :hint="field.attrs?.hint"
    v-bind="field.attrs?.elementFormGroup"
  >
    <USelectMenu
      v-if="field.attrs?.['field:type'] === 'Quantity'"
      v-model.number="internalValue"
      :options="
        Array.from(
          { length: field.max - field.min + 1 },
          (_, i) => i + field.min,
        )
      "
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
    <USelectMenu
      v-else-if="Array.isArray(field.enum)"
      v-model="internalValue"
      :options="field.enum"
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
    <UTextarea
      v-else-if="field.attrs?.['field:type'] === 'Textarea'"
      v-model.trim="internalValue"
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
    <UInput
      v-else-if="field.attrs?.['field:type'] === 'Number'"
      v-model.number="internalValue"
      type="number"
      :min="field.min"
      :max="field.max"
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
    <UInput
      v-else-if="field.attrs?.['field:type'] !== 'Trigger'"
      ref="el"
      v-model.trim="internalValue"
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
  </UFormGroup>
</template>

<script lang="ts" setup>
import type useForm from '@tarcltd/form-vue'
import { type SchemaField } from '@tarcltd/form-vue'
import { deepEqual } from 'fast-equals'
import { computed, ref, onMounted, watch } from 'vue'

const props = defineProps<{
  modelValue?: string | number | boolean
  fieldKey: string
  field: SchemaField
  input: ReturnType<typeof useForm>['input']
  disabled?: boolean
}>()
const emit = defineEmits(['update:modelValue'])
const internalValue = computed({
  get: () => props.modelValue,
  set(value) {
    if (!deepEqual(value, props.modelValue)) {
      emit('update:modelValue', value)
    }
  },
})
const el = ref()

onMounted(async () => {
  try {
    if (!el.value || !el.value.input) {
      return
    }

    if (
      props.field.attrs?.mask
      && (props.field.type === 'date'
      || props.field.type === 'time'
      || props.field.type === 'datetime')
    ) {
      const inputMask = await import('inputmask')

      inputMask
        .default('datetime', {
          inputFormat: props.field.attrs?.mask,
        })
        .mask(el.value.input)
    }
    else if (typeof props.field.attrs?.mask === 'string') {
      const inputMask = await import('inputmask')

      inputMask.default(props.field.attrs?.mask).mask(el.value.input)
    }
  }
  catch (error) {
    console.error(error)
  }
})

watch(
  () => props.field,
  (value) => {
    if (value.attrs?.default && !internalValue.value) {
      internalValue.value = value.attrs?.default
    }
  },
  { deep: true, immediate: true },
)
</script>
