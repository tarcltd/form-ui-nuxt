<template>
  <UCheckbox
    v-if="field.type === 'boolean'"
    v-model="internalValue"
    :label="field.name"
    v-bind="field.attrs?.elementFormGroup"
    :disabled="disabled"
  />
  <URadioGroup
    v-else-if="field.attrs?.ui === 'URadioGroup'"
    v-model="internalValue"
    :legend="field.name"
    :options="field.enum.map((e: string) => ({ label: e, value: e }))"
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
      v-if="
        field.type === 'number' && field.attrs?.ui === 'USelectMenu.quantity'
      "
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
      v-else-if="field.type === 'string' && field.attrs?.ui === 'USelectMenu'"
      v-model="internalValue"
      :options="field.enum"
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
    <UTextarea
      v-else-if="field.type === 'string' && field.attrs?.ui === 'UTextarea'"
      v-model.trim="internalValue"
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
    <UInput
      v-else-if="field.type === 'email'"
      v-model.trim="internalValue"
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
    <UInput
      v-else-if="field.type === 'number'"
      v-model.number="internalValue"
      type="number"
      :min="field.min"
      :max="field.max"
      v-bind="field.attrs?.elementInput"
      :disabled="disabled"
    />
    <UInput
      v-else
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
import { computed, ref, onMounted } from 'vue'

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
    emit('update:modelValue', value)
  },
})
const el = ref()

onMounted(async () => {
  try {
    if (!el.value) {
      return
    }

    if (el.value.input && props.field.attrs?.pattern) {
      const inputMask = await import('inputmask')

      inputMask
        .default({ regex: props.field.attrs?.pattern })
        .mask(el.value.input)
    }
  }
  catch (error) {
    console.error(error)
  }
})
</script>
