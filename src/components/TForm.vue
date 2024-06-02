<template>
  <UForm
    :ref="formRef"
    :state="modelValue"
    :schema="schema"
    class="flex flex-col w-full"
  >
    <slot name="leading" />
    <TFormField
      v-for="[key, field] in useSortedFields(input)"
      :key="key"
      v-model="internalValue[key]"
      :field-key="key"
      :field="field"
      :input="input"
    />
    <slot />
  </UForm>
</template>

<script lang="ts" setup>
import type useForm from '@tarcltd/form-vue'
import { computed, ref } from 'vue'
import { deepEqual } from 'fast-equals'
import useSortedFields from '../composables/useFieldSort'
import TFormField from './TFormField.vue'

const props = defineProps<{
  modelValue: ReturnType<typeof useForm>['state']
  input: ReturnType<typeof useForm>['input']
  schema: ReturnType<typeof useForm>['schema']
}>()
const emit = defineEmits(['update:modelValue'])
const formRef = ref()
const internalValue = computed({
  get: () => props.modelValue,
  set(value) {
    if (!deepEqual(value, props.modelValue)) {
      emit('update:modelValue', value)
    }
  },
})
</script>
