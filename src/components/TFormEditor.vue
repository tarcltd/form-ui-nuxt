<template>
  <Draggable
    v-model="sortedFields"
    group="fields"
    handle=".drag-handle"
    animation="150"
    item-key="name"
    class="flex flex-col w-full"
    @start="drag = true"
    @end="drag = false"
    @click="emit('editField', null)"
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
          'select-none': true,
          'cursor-pointer': true,
        }"
        @contextmenu.prevent="onContextMenu(element)"
        @click.stop.prevent="emit('editField', element)"
      >
        <div class="flex items-center justify-between">
          <UIcon
            name="i-ph-dots-six-vertical"
            class="drag-handle text-gray-300 dark:text-gray-700"
            :style="{
              cursor: 'ns-resize',
            }"
          />
          <div class="flex items-center gap-4">
            <UButton
              variant="link"
              class="p-0"
              size="sm"
              @click.stop.prevent="onModifyGroup(element)"
            >
              Modify group
            </UButton>
            <UButton
              variant="link"
              class="p-0"
              size="sm"
              @click.stop.prevent="onRemove(element[0])"
            >
              Remove
            </UButton>
            <span class="text-sm text-gray-500 dark:text-gray-700">
              |
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-700">
              {{ element[1].attrs.group }}
            </span>
          </div>
        </div>
        <TFormField
          v-model="stubModel"
          :field-key="element[0]"
          :field="element[1]"
          :input="internalValue"
          disabled
          class="pointer-events-none"
        />
        <UContextMenu
          v-model="isOpen"
          :virtual-element="virtualElement"
        >
          <div class="grid p-2">
            <UButton
              variant="ghost"
              @click.stop="onModifyGroup(element)"
            >
              Modify group
            </UButton>
            <UButton
              variant="ghost"
              @click.stop="onRemove(element[0])"
            >
              Remove
            </UButton>
          </div>
        </UContextMenu>
      </div>
    </template>
  </Draggable>
</template>

<script lang="ts" setup>
import { useMouse, useWindowScroll } from '@vueuse/core'
import Draggable from 'vuedraggable'
import type useForm from '@tarcltd/form-vue'
import { computed, ref, watch, unref } from 'vue'
import type { Schema, SchemaField } from '@tarcltd/form-vue'
import { deepEqual } from 'fast-equals'
import useSortedFields from '../composables/useFieldSort'
import TFormField from './TFormField.vue'

const props = defineProps<{
  modelValue: ReturnType<typeof useForm>['input']
}>()
const emit = defineEmits(['update:modelValue', 'editField', 'editGroup'])
const internalValue = computed({
  get: () => props.modelValue,
  set(value) {
    if (!deepEqual(value, props.modelValue)) {
      emit('update:modelValue', value)
    }
  },
})
const sortedFields = ref<[string, SchemaField][]>([])
const drag = ref(false)
const stubModel = ref('')
const { x, y } = useMouse()
const { y: windowY } = useWindowScroll()
const isOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({}) })
const activeField = ref<[string, SchemaField] | null>(null)

function onContextMenu(element: [string, SchemaField]) {
  const top = unref(y) - unref(windowY)
  const left = unref(x)

  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left,
  })

  isOpen.value = true

  activeField.value = element

  emit('editField', element)
}

function onRemove(fieldKey: string) {
  isOpen.value = false

  const newProperties: Record<string, SchemaField> = {}

  for (const [index, [key, field]] of sortedFields.value.entries()) {
    if (key === fieldKey) {
      continue
    }

    newProperties[key] = {
      ...field,
      attrs: {
        ...field.attrs,
        order: index + 1,
      },
    }
  }

  if (Object.keys(newProperties).length === 0) {
    internalValue.value = {} as Schema
  }
  else {
    internalValue.value.properties = newProperties

    internalValue.value.required = internalValue.value.required.filter(key => key !== fieldKey)

    if (Array.isArray(internalValue.value.metadata?.triggers)) {
      internalValue.value.metadata.triggers = internalValue.value.metadata?.triggers.filter(
        trigger => trigger.source !== internalValue.value.properties[fieldKey]?.name,
      )

      if (internalValue.value.metadata?.triggers.length === 0) {
        delete internalValue.value.metadata?.triggers
      }
    }

    if (internalValue.value.metadata && Object.keys(internalValue.value.metadata).length === 0) {
      delete internalValue.value.metadata
    }
  }

  activeField.value = null

  emit('editField', null)
}

function onModifyGroup(element: [string, SchemaField]) {
  isOpen.value = false

  activeField.value = null

  emit('editField', null)
  emit('editGroup', element)
}

watch(
  internalValue,
  (value) => {
    sortedFields.value = useSortedFields(value)
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
