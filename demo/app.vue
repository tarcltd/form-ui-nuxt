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
      'overflow-hidden': true,
    }"
  >
    <div class="overflow-hidden overflow-y-auto pl-4 pr-2 py-4">
      <div class="flex justify-between mb-4">
        <h1 class="text-lg min-h-6">
          {{ view }}
        </h1>
        <div class="flex gap-4 items-center">
          <UButton
            variant="link"
            class="p-0"
            @click="builderSchema = {}"
          >
            Reset
          </UButton>
          <UButtonGroup>
            <UButton
              :color="view === 'Preview' ? 'primary' : 'gray'"
              @click="view = 'Preview'"
            >
              Preview
            </UButton>
            <UButton
              :color="view === 'Editor' ? 'primary' : 'gray'"
              @click="view = 'Editor'"
            >
              Editor
            </UButton>
            <UButton
              :color="view === 'JSON' ? 'primary' : 'gray'"
              @click="view = 'JSON'"
            >
              JSON
            </UButton>
          </UButtonGroup>
          <UButton
            variant="link"
            class="p-0"
            :disabled="Object.keys(builderSchema).length === 0"
            @click="onExport"
          >
            Export
          </UButton>
        </div>
      </div>
      <TForm
        v-if="view === 'Preview'"
        v-model="exampleForm.state"
        :input="exampleForm.input"
        :schema="exampleForm.schema"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UButton
          v-if="
            exampleForm?.input?.properties
              && Object.keys(exampleForm.input.properties).length
          "
          type="submit"
          class="w-fit ml-auto"
          :disabled="exampleForm.isValid.value === false"
        >
          Submit
        </UButton>
      </TForm>
      <TFormEditor
        v-else-if="view === 'Editor'"
        v-model="exampleForm.input"
        class="space-y-4"
        @edit-field="fieldInEdit = $event"
        @edit-group="onGroupEdit"
      />
      <pre
        v-else-if="view === 'JSON'"
        class="text-sm"
      >
        {{ JSON.stringify(builderSchema, null, 2) }}
      </pre>
    </div>
    <div
      :class="{
        'grid': true,
        'w-[250px]': true,
        'pl-2 pr-4 py-4': true,
        'box-border': true,
        'h-full': true,
        'overflow-hidden': true,
        'overflow-y-auto': true,
      }"
    >
      <TFormFieldEditor
        v-model="builderSchema"
        v-model:field="fieldInEdit"
        :mode
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const view = ref<'Preview' | 'Editor' | 'JSON'>('Editor')
const mode = ref<'field' | 'group'>('field')
const fieldInEdit = ref<[string, SchemaField] | null>(null)
const builderSchema = ref<ReturnType<typeof useForm>['input']>({})
let exampleForm = useForm(builderSchema.value)

function onGroupEdit(field: [string, SchemaField] | null) {
  mode.value = 'group'
  fieldInEdit.value = field
}

function onSubmit() {
  console.log(exampleForm.state)

  exampleForm.reset()
}

function onExport() {
  const blob = new Blob([JSON.stringify(exampleForm.input, null, 2)], {
    type: 'application/json',
  })

  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')

  a.href = url
  a.download = 'form.json'

  a.click()

  URL.revokeObjectURL(url)
}

watch(builderSchema, (value) => {
  fieldInEdit.value = null

  exampleForm = useForm(value)
})
</script>
