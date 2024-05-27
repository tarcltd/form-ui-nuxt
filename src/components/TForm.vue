<template>
  <u-form
    :state="state"
    :schema="schema"
    class="w-full h-full"
  >
    <template
      v-for="(field, key) in input.properties"
      :key="key"
    >
      {{ key }} - {{ field }}
    </template>
  </u-form>
</template>

<script lang="ts" setup>
import type useForm from '@tarcltd/form-vue'

defineProps<{
  input: ReturnType<typeof useForm>['input']
  state: ReturnType<typeof useForm>['state']
  schema: ReturnType<typeof useForm>['schema']
}>()
</script>
