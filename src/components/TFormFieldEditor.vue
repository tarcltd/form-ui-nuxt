<template>
  <UForm
    v-if="internalMode ==='field' && viewMode === 'edit' && inputType"
    :key="inputType"
    :state="form.state"
    :schema="form.schema"
    class="relative flex flex-col w-full space-y-4"
    @submit="onSubmit"
  >
    <UButton
      color="gray"
      block
      leading-icon="i-ph-arrow-left"
      @click="viewMode = 'typeSelect'"
    >
      Select type
    </UButton>
    <h2>{{ inputType }} settings</h2>
    <template
      v-for="(option, key) in internalSchema.properties"
      :key="key"
    >
      <template v-if="!option.attrs?.advanced">
        <UCheckbox
          v-if="option.attrs?.['field:type'] !== 'trigger:value' && option.type === 'boolean'"
          v-model="form.state[key]"
          :name="key"
          :label="option.name ?? sentenceCase(key)"
        />
        <UFormGroup
          v-else
          :name="key"
          :label="option.name ?? sentenceCase(key)"
        >
          <USelectMenu
            v-if="option.enum"
            v-model="form.state[key]"
            :options="option.enum"
          />
          <div
            v-else-if="option.attrs?.['field:type'] === 'trigger:value'"
            class="flex items-start"
          >
            <USelectMenu
              v-model="option.type"
              :options="[
                {
                  label: 'Text',
                  value: 'string',
                }, {
                  label: 'Number',
                  value: 'number',
                },
                {
                  label: 'Boolean',
                  value: 'boolean',
                },
              ]"
              :ui="{ rounded: 'rounded-none' }"
              :style="{
                borderTopLeftRadius: '0.375rem',
                borderBottomLeftRadius: '0.375rem',
              }"
              value-attribute="value"
            >
              <template #label>
                <UIcon
                  :name="(appConfig.ui as any)?.form?.icons?.[option.type === 'string'
                    ? 'Text'
                    : sentenceCase(option.type)] ?? 'i-ph-question'"
                  class="h-5 w-5"
                />
              </template>
            </USelectMenu>
            <USelectMenu
              v-if="option.type === 'boolean'"
              v-model="form.state[key]"
              :options="[{
                label: 'True',
                value: true,
              }, {
                label: 'False',
                value: false,
              }]"
              :ui="{ rounded: 'rounded-none' }"
              class="w-full"
              :style="{
                borderTopRightRadius: '0.375rem',
                borderBottomRightRadius: '0.375rem',
              }"
              value-attribute="value"
            />
            <UInput
              v-else
              v-model.trim="form.state[key]"
              :type="option.type"
              :ui="{ rounded: 'rounded-none' }"
              :style="{
                borderTopRightRadius: '0.375rem',
                borderBottomRightRadius: '0.375rem',
              }"
            />
          </div>
          <UInput
            v-else
            v-model.trim="form.state[key]"
            :type="option.type"
          />
          <template #hint>
            <UPopover
              v-if="option.attrs?.help"
              mode="hover"
              :popper="{ placement: 'auto-end' }"
            >
              <template #panel>
                <p class="p-4 max-w-[250px] text-sm">
                  {{ option.attrs.help }}
                </p>
              </template>
              <UIcon name="i-heroicons-information-circle" />
            </UPopover>
          </template>
        </UFormGroup>
        <template
          v-if="
            key === 'label' && (inputType === 'Select' || inputType === 'Radio')
          "
        >
          <UFormGroup
            v-for="(_selectOpt, index) in inputOptions"
            :key="index"
            :label="`Option ${index + 1}`"
          >
            <template #hint>
              <UButton
                variant="link"
                class="p-0"
                size="xs"
                @click="inputOptions.splice(index, 1)"
              >
                Remove
              </UButton>
            </template>
            <UInput v-model.trim="inputOptions[index]" />
          </UFormGroup>
          <UButton @click="inputOptions.push('')">
            Add option
          </UButton>
        </template>
      </template>
    </template>
    <UAccordion
      v-if="Object.keys(internalAdvancedProperties).length"
      :items="[
        {
          label: 'Advanced options',
        },
      ]"
    >
      <template #item>
        <div class="flex flex-col gap-4 w-full h-full">
          <template
            v-for="(option, key) in internalAdvancedProperties"
            :key="key"
          >
            <UCheckbox
              v-if="option.type === 'boolean'"
              v-model="form.state[key]"
              :name="key"
              :label="option.name ?? sentenceCase(key)"
            />
            <UFormGroup
              v-else
              :name="key"
              :label="option.name ?? sentenceCase(key)"
            >
              <USelectMenu
                v-if="option.enum"
                v-model="form.state[key]"
                :options="option.enum"
              />
              <UInput
                v-else
                v-model.trim="form.state[key]"
                :type="option.type"
              />
              <template #hint>
                <UPopover
                  v-if="option.attrs?.help"
                  mode="hover"
                  :popper="{ placement: 'auto-end' }"
                >
                  <template #panel>
                    <p class="p-4 max-w-[250px] text-sm">
                      {{ option.attrs.help }}
                    </p>
                  </template>
                  <UIcon name="i-heroicons-information-circle" />
                </UPopover>
              </template>
            </UFormGroup>
          </template>
        </div>
      </template>
    </UAccordion>
    <div class="sticky bottom-0 left-0 right-0 flex flex-col gap-2">
      <div
        class="grid gap-2 w-full"
        :style="{
          gridTemplateColumns: internalField ? `repeat(2, 1fr)` : `1fr`,
        }"
      >
        <UButton
          size="sm"
          color="gray"
          block
          @click="onCancel"
        >
          Cancel
        </UButton>
        <UButton
          v-if="internalField"
          size="sm"
          color="red"
          block
          @click="onRemove"
        >
          Remove
        </UButton>
      </div>
      <UButton
        v-if="inputType === 'Trigger'"
        type="submit"
        block
      >
        {{ props.field ? "Update trigger" : "Add trigger" }}
      </UButton>
      <UButton
        v-else-if="inputType === 'Link'"
        type="submit"
        block
      >
        {{ props.field ? "Update link" : "Add link" }}
      </UButton>
      <UButton
        v-else-if="inputType === 'Action'"
        type="submit"
        block
      >
        {{ props.field ? "Update action" : "Add action" }}
      </UButton>
      <UButton
        v-else
        type="submit"
        block
      >
        {{ props.field ? "Update field" : "Add field" }}
      </UButton>
    </div>
  </UForm>
  <UForm
    v-else-if="internalMode === 'field'"
    :state="{
      inputType,
      search,
    }"
    class="relative flex flex-col gap-2"
    @submit="viewMode = 'edit'"
  >
    <UInput
      v-model="search"
      name="search"
      class="sticky top-0 left-0 right-0 w-full h-fit"
      leading-icon="i-ph-magnifying-glass"
      placeholder="Search..."
    />
    <div
      class="grid gap-2"
      :style="{
        gridTemplateColumns: `repeat(2, 1fr)`,
      }"
    >
      <div
        v-for="t in results"
        :key="t.item"
        tabindex="0"
        :class="{
          'outline-none': true,
          'flex': true,
          'flex-col': true,
          'items-center': true,
          'justify-center': true,
          'gap-2': true,
          'p-2': true,
          'rounded': true,
          'border': true,
          'border-solid': true,
          'cursor-pointer': true,
          'text-gray-500 dark:text-gray-300': true,
          'select-none': true,
          'text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800':
            inputType !== t.item,
          'border-primary-500 text-primary-500 dark:text-primary-500 bg-gray-100 dark:bg-gray-800':
            inputType === t.item,
        }"
        @click="
          inputType === t.item ? (viewMode = 'edit') : (inputType = t.item)
        "
        @keydown.enter="
          inputType === t.item ? (viewMode = 'edit') : (inputType = t.item)
        "
      >
        <UIcon
          :name="
            (appConfig.ui as any)?.form?.icons?.[t.item] ?? 'i-ph-question'
          "
          class="h-6 w-6"
        />
        <span class="text-sm">{{ t.item }}</span>
      </div>
    </div>
    <div
      v-if="results.length === 0"
      class="w-full p-4 text-center text-sm text-gray-500 dark:text-gray-300"
    >
      <span>No results found.</span>
    </div>
    <div class="sticky bottom-0 left-0 right-0">
      <UButton
        type="submit"
        block
      >
        Continue
      </UButton>
    </div>
  </UForm>
  <UForm
    v-else-if="internalMode === 'group'"
    :state="{}"
    class="relative flex flex-col gap-2"
    @submit="viewMode = 'edit'"
  >
    <h2>Group settings</h2>
    <div class="sticky bottom-0 left-0 right-0 flex flex-col gap-2">
      <div
        class="grid gap-2 w-full"
        :style="{
          gridTemplateColumns: internalField ? `repeat(2, 1fr)` : `1fr`,
        }"
      >
        <UButton
          size="sm"
          color="gray"
          block
          @click="onCancel"
        >
          Cancel
        </UButton>
        <UButton
          v-if="internalField"
          size="sm"
          color="red"
          block
          @click="onRemove"
        >
          Remove
        </UButton>
      </div>
    </div>
  </UForm>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { camelCase, sentenceCase, snakeCase } from 'change-case'
import useForm, { type SchemaField, type Schema } from '@tarcltd/form-vue'
import { useFuse } from '@vueuse/integrations/useFuse'
import { deepEqual } from 'fast-equals'
import generateSchema from '../factories'
import useDeepObjSet from '../composables/useDeepObjSet'
import { useAppConfig, useRuntimeConfig } from '#imports'

const props = withDefaults(defineProps<{
  modelValue: ReturnType<typeof useForm>['input']
  mode: 'field' | 'group'
  field?: [string, SchemaField] | null
  inputTypes?: string[]
}>(), {
  mode: 'field',
})
const emit = defineEmits(['update:modelValue', 'update:mode', 'update:field'])
const viewMode = ref<'typeSelect' | 'edit'>('typeSelect')
const appConfig = useAppConfig()
const config = useRuntimeConfig().public.formUiNuxt
const internalInputTypes = ref(props.inputTypes ?? config.inputTypes ?? [])
const search = ref('')
const { results } = useFuse(search, internalInputTypes, {
  fuseOptions: {
    threshold: 0.1,
  },
  matchAllWhenSearchEmpty: true,
})
const internalValue = computed({
  get: () => props.modelValue,
  set(value) {
    if (!deepEqual(value, props.modelValue)) {
      emit('update:modelValue', value)
    }
  },
})
const internalMode = computed({
  get: () => props.mode,
  set(value) {
    if (!deepEqual(value, props.mode)) {
      emit('update:mode', value)
    }
  },
})
const internalField = computed({
  get: () => props.field,
  set(value) {
    if (!deepEqual(value, props.modelValue)) {
      emit('update:field', value)
    }
  },
})
const internalSchema = ref<ReturnType<typeof useForm>['input']>({
  type: 'object',
  properties: {},
  required: [],
})
const internalAdvancedProperties = computed(() => {
  const properties: Record<string, SchemaField> = {}

  for (const [key, field] of Object.entries(internalSchema.value.properties)) {
    if (field.attrs?.advanced) {
      properties[key] = field
    }
  }

  return properties
})
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const internalDefaults = ref<Record<string, any>>({})
const inputType = ref<string | null>('Text')
const inputOptions = ref<string[]>([])
let form = useForm(internalSchema.value, {
  defaults: internalDefaults.value,
})

function onSubmit() {
  if (!form.isValid.value) {
    return
  }

  const newForm = {
    ...internalValue.value,
    type: 'object',
    properties: {
      ...Object.entries(internalValue.value.properties ?? {}).reduce<Record<string, SchemaField>>((acc, [key, value]) => {
        if (key !== props.field?.[0]) {
          acc[key] = value
        }

        return acc
      }, {}),
    },
    required: [...(internalValue.value.required ?? []).filter(key => key !== internalField.value?.[0])],
  } satisfies ReturnType<typeof useForm>['input']
  const newKey = snakeCase(form.state.label ?? '')
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const newField: Record<string, any> = {}

  for (const [key, subvalue] of Object.entries(form.state)) {
    if (typeof subvalue === 'string' && subvalue.length === 0) {
      continue
    }

    if (key === 'inputType' || key === 'required') {
      continue
    }

    const field = form.input.properties[key]

    if (inputType.value === 'Trigger' || inputType.value === 'Link' || inputType.value === 'Action') {
      if (key !== 'field:type') {
        newField[camelCase(key)] = subvalue
      }
    }
    else if (key === 'field:type') {
      newField.attrs = {
        ...newField.attrs,
        'field:type': subvalue,
      }
    }
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    else if ((field as any)?._path) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      useDeepObjSet(newField, (field as any)._path, subvalue)
    }
    else if (field) {
      newField[camelCase(key)] = subvalue
    }
  }

  if (inputType.value === 'Trigger') {
    newForm.metadata = {
      ...newForm.metadata,
      triggers: [...(newForm.metadata?.triggers ?? []), newField],
    }
  }
  else if (inputType.value === 'Link') {
    newForm.metadata = {
      ...newForm.metadata,
      links: [...(newForm.metadata?.links ?? []), newField],
    }
  }
  else if (inputType.value === 'Action') {
    newForm.metadata = {
      ...newForm.metadata,
      actions: [...(newForm.metadata?.actions ?? []), newField],
    }
  }
  else {
    if (inputOptions.value.length) {
      newField.enum = inputOptions.value
    }

    if (!newField.type) {
      newField.type = 'string'
    }

    if (form.state.required && !newForm.required.includes(newKey)) {
      newForm.required.push(newKey)
    }

    newField.attrs.elementInput = {
      ...form.state.elementInput,
      ...newField.attrs.elementInput,
    }

    newForm.properties[newKey] = newField
  }

  internalValue.value = newForm

  onCancel()
}

function onCancel() {
  viewMode.value = 'typeSelect'
  internalMode.value = 'field'

  inputType.value = null
  internalField.value = null

  inputType.value = 'Text'

  form.reset()
}

function onRemove() {
  if (!internalField.value) {
    return
  }

  const newProperties: Record<string, SchemaField> = {}

  for (const [index, [key, field]] of Object.entries(
    internalValue.value.properties,
  ).entries()) {
    if (key === internalField.value[0]) {
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

    internalValue.value.required = internalValue.value.required.filter(key => key !== internalField.value?.[0])

    if (Array.isArray(internalValue.value.metadata?.triggers)) {
      internalValue.value.metadata.triggers = internalValue.value.metadata?.triggers.filter(
        trigger => trigger.source !== internalField.value?.[1]?.name,
      )

      if (internalValue.value.metadata?.triggers.length === 0) {
        delete internalValue.value.metadata?.triggers
      }
    }

    if (internalValue.value.metadata && Object.keys(internalValue.value.metadata).length === 0) {
      delete internalValue.value.metadata
    }
  }

  onCancel()
}

function createForm(type: string | null) {
  if (!type) {
    return
  }

  const fieldBuilderSchema = generateSchema(type, internalValue.value)

  if (!fieldBuilderSchema) {
    return
  }

  internalSchema.value = fieldBuilderSchema[0]
  internalDefaults.value = fieldBuilderSchema[1]
  inputOptions.value = fieldBuilderSchema[0].properties?.default?.enum ?? []

  if (props.field && internalField.value) {
    for (const key in internalSchema.value.properties) {
      if (key === 'label') {
        internalDefaults.value.label = internalField.value[1].name
      }
      else if (key in internalField.value[1]) {
        internalDefaults.value[key]
          = internalField.value[1][key as keyof SchemaField]
      }
      else if (key in (internalField.value[1].attrs ?? {})) {
        internalDefaults.value[key] = internalField.value[1].attrs[key]
      }
      else if (key in (internalField.value[1].attrs?.elementInput ?? {})) {
        internalDefaults.value[key]
          = internalField.value[1].attrs?.elementInput[key]
      }
    }

    internalDefaults.value.required = internalValue.value.required.includes(
      props.field[0],
    )

    inputOptions.value = internalField.value[1].enum ?? []

    viewMode.value = 'edit'
  }
  else {
    viewMode.value = 'typeSelect'
  }

  form = useForm(internalSchema.value, {
    defaults: internalDefaults.value,
  })
}

watch(
  () => props.inputTypes,
  (value) => {
    if (Array.isArray(value)) {
      internalInputTypes.value = value
    }
  },
  { deep: true },
)

watch(inputType, createForm, { immediate: true })

watch(
  internalField,
  (value) => {
    if (internalMode.value === 'group') {
      // TODO: Group edit mode
    }
    else {
      if (value) {
        inputType.value = value[1].attrs['field:type']
      }

      createForm(inputType.value)
    }
  },
  { immediate: true, deep: true },
)

watch(viewMode, () => {
  search.value = ''
})
</script>
