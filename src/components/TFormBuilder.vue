<template>
  <UForm
    v-if="inputType"
    :key="inputType"
    :state="form.state"
    :schema="form.schema"
    class="flex flex-col w-full"
    @submit="onSubmit"
  >
    <UFormGroup name="inputType" label="Type">
      <USelectMenu v-model="inputType" :options="internalInputTypes" />
    </UFormGroup>
    <template v-for="(option, key) in internalSchema.properties" :key="key">
      <template v-if="!option.attrs?.advanced">
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
          <UInput v-else v-model.trim="form.state[key]" :type="option.type" />
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
          <UButton @click="inputOptions.push('')"> Add option </UButton>
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
    <UButton type="submit" block>
      {{ props.field ? "Update field" : "Add field" }}
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from "vue";
import { camelCase, sentenceCase, snakeCase } from "change-case";
import useForm, { type SchemaField } from "@tarcltd/form-vue";
import generateSchema from "../factories";
import useDeepObjSet from "../composables/useDeepObjSet";
import { useRuntimeConfig } from "#imports";

const props = defineProps<{
  modelValue: ReturnType<typeof useForm>["input"];
  field?: [string, SchemaField] | null;
  inputTypes?: string[];
}>();
const emit = defineEmits(["update:modelValue", "update:field"]);
const config = useRuntimeConfig().public.formUiNuxt;
const internalInputTypes = ref(props.inputTypes ?? config.inputTypes);
const internalValue = computed({
  get: () => props.modelValue,
  set(value) {
    emit("update:modelValue", value);
  },
});
const internalField = computed({
  get: () => props.field,
  set(value) {
    emit("update:field", value);
  },
});
const internalSchema = ref<ReturnType<typeof useForm>["input"]>({
  type: "object",
  properties: {},
  required: [],
});
const internalAdvancedProperties = computed(() => {
  const properties: Record<string, SchemaField> = {};

  for (const [key, field] of Object.entries(internalSchema.value.properties)) {
    if (field.attrs?.advanced) {
      properties[key] = field;
    }
  }

  return properties;
});
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const internalDefaults = ref<Record<string, any>>({});
const inputType = ref<string | null>("Text");
const inputOptions = ref<string[]>([]);
let form = useForm(internalSchema.value, {
  defaults: internalDefaults.value,
});

function onSubmit() {
  if (!form.isValid.value) {
    return;
  }

  const newForm = {
    ...internalValue.value,
    type: "object",
    properties: {
      ...internalValue.value.properties,
    },
    required: [...(internalValue.value.required ?? [])],
  } satisfies ReturnType<typeof useForm>["input"];
  const newKey = `${form.state.groupId}:${snakeCase(form.state.label)}`;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const newField: Record<string, any> = {
    type: form.state["field:type"] ?? "string",
    attrs: {
      inputType: inputType.value,
    },
  };

  if (form.state.required && !newForm.required.includes(newKey)) {
    newForm.required.push(newKey);
  } else if (!form.state.required && newForm.required.includes(newKey)) {
    newForm.required = newForm.required.filter((key) => key !== newKey);
  }

  if (inputOptions.value.length) {
    newField.enum = inputOptions.value;
  }

  for (const [key, subvalue] of Object.entries(form.state)) {
    if (key === "field:type" || key === "required") {
      continue;
    }

    if (key === "ui") {
      newField.attrs.ui = subvalue;
      continue;
    }

    const field = form.input.properties[key];

    if (!field) {
      continue;
    }

    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    if ((field as any)._path) {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      useDeepObjSet(newField, (field as any)._path, subvalue);
    } else {
      newField[camelCase(key)] = subvalue;
    }
  }

  newForm.properties[newKey] = newField;

  if (props.field) {
    newForm.properties[newKey] = newField;

    if (newKey !== props.field[0]) {
      /* eslint-disable-next-line @typescript-eslint/no-dynamic-delete */
      delete newForm.properties[props.field[0]];
    }

    internalField.value = null;
  }

  internalValue.value = newForm;

  inputType.value = null;

  inputType.value = "Text";

  form.reset();
}

function createForm(inputType: string | null) {
  if (!inputType) {
    return;
  }

  const fieldBuilderSchema = generateSchema(inputType, internalValue.value);

  if (!fieldBuilderSchema) {
    return;
  }

  internalSchema.value = fieldBuilderSchema[0];
  internalDefaults.value = fieldBuilderSchema[1];
  inputOptions.value = fieldBuilderSchema[0].properties?.default?.enum ?? [];

  if (props.field && internalField.value) {
    for (const key in internalSchema.value.properties) {
      if (key === "label") {
        internalDefaults.value.label = internalField.value[1].name;
      } else if (key in internalField.value[1]) {
        internalDefaults.value[key] =
          internalField.value[1][key as keyof SchemaField];
      } else if (key in (internalField.value[1].attrs ?? {})) {
        internalDefaults.value[key] = internalField.value[1].attrs[key];
      } else if (key in (internalField.value[1].attrs?.elementInput ?? {})) {
        internalDefaults.value[key] =
          internalField.value[1].attrs?.elementInput[key];
      }
    }

    internalDefaults.value.required = internalValue.value.required.includes(
      props.field[0]
    );

    inputOptions.value = internalField.value[1].enum ?? [];
  }

  form = useForm(internalSchema.value, {
    defaults: internalDefaults.value,
  });
}

watch(
  () => props.inputTypes,
  (value) => {
    internalInputTypes.value = value;
  },
  { deep: true }
);

watch(inputType, createForm, { immediate: true });

watch(
  internalField,
  (value) => {
    if (value) {
      inputType.value = value[1].attrs?.inputType;
    }

    createForm(inputType.value);
  },
  { immediate: true }
);
</script>
