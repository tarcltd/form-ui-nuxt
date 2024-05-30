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
          <span class="text-sm text-gray-500 dark:text-gray-700">
            {{ element[1].attrs.groupId }}
          </span>
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
              @click.stop="onRemove()"
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
import type { SchemaField } from '@tarcltd/form-vue'
import useSortedFields from '../composables/useFieldSort'
import TFormField from './TFormField.vue'

const props = defineProps<{
  modelValue: ReturnType<typeof useForm>['input']
}>()
const emit = defineEmits(['update:modelValue', 'editField'])
const internalValue = computed({
  get: () => props.modelValue,
  set(value) {
    emit('update:modelValue', value)
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

function onRemove() {
  if (!activeField.value) {
    return
  }

  const newProperties: Record<string, SchemaField> = {}

  for (const [index, [key, field]] of sortedFields.value.entries()) {
    if (key === activeField.value[0]) {
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

  internalValue.value.properties = newProperties

  activeField.value = null

  isOpen.value = false

  emit('editField', null)
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
