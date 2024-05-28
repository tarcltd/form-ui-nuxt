<template>
  <UForm
    :key="inputType"
    :state="form.state"
    :schema="form.schema"
    class="flex flex-col w-full"
    @submit="onSubmit"
  >
    <UFormGroup
      name="inputType"
      label="Input type"
    >
      <USelectMenu
        v-model="inputType"
        :options="inputTypes"
      />
    </UFormGroup>
    <template
      v-for="(option, key) in internalSchema.properties"
      :key="key"
    >
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
      :items="[
        {
          label: 'Advanced options',
        },
      ]"
    >
      <template #item>
        <div class="flex flex-col gap-4 w-full h-full">
          <template
            v-for="(option, key) in internalSchema.properties"
            :key="key"
          >
            <template v-if="option.attrs?.advanced">
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
          </template>
        </div>
      </template>
    </UAccordion>
    <UButton
      type="submit"
      block
    >
      Add field
    </UButton>
  </UForm>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { sentenceCase, snakeCase } from 'change-case'
import useForm from '@tarcltd/form-vue'
import defu from 'defu'

const props = withDefaults(
  defineProps<{
    modelValue: ReturnType<typeof useForm>['input']
    inputTypes?: string[]
  }>(),
  {
    inputTypes: () => [
      'Text',
      'Textarea',
      'Number',
      'Email',
      'Phone',
      'Password',
      'Select',
      'Quantity',
      'Radio',
      'Date',
      'Time',
      'Datetime',
      'Yes / No',
      'Boolean',
      'Checkbox',
      'File',
      'Image',
      // TODO: Add color picker UI
      // "Color",
      'URL',
      'UUID',
    ],
  },
)
const emit = defineEmits(['update:modelValue'])
const internalValue = computed({
  get: () => props.modelValue,
  set(value) {
    emit('update:modelValue', value)
  },
})
const internalSchema = ref<ReturnType<typeof useForm>['input']>({
  type: 'object',
  properties: {},
  required: [],
})
/* eslint-disable @typescript-eslint/no-explicit-any */
const internalDefaults = ref<Record<string, any>>({})
const inputType = ref('Text')
const inputOptions = ref<string[]>([])
let form = useForm(internalSchema.value, {
  defaults: internalDefaults.value,
})
const help = {
  type: 'string',
  name: 'Help',
  attrs: {
    help: 'The help text appearing under the field.',
    advanced: true,
  },
}
const hint = {
  type: 'string',
  name: 'Hint',
  attrs: {
    help: 'The hint text appearing above the field.',
    advanced: true,
  },
}
const placeholder = {
  type: 'string',
  name: 'Placeholder',
  attrs: {
    help: 'The placeholder text appearing in the field. It\'s recommended to leave this empty.',
    advanced: true,
  },
}
const autocomplete = {
  type: 'string',
  name: 'Autocomplete',
  attrs: {
    help: 'The HTML autocomplete attribute.',
    advanced: true,
  },
}
const formDefaults: ReturnType<typeof useForm>['input'] = {
  type: 'object',
  properties: {
    label: {
      type: 'string',
      name: 'Label',
      minLength: 1,
    },
    required: {
      type: 'boolean',
      name: 'Required',
    },
    description: {
      type: 'string',
      name: 'Description',
      attrs: {
        help: 'A description of the field for JSON schema documentation.',
        advanced: true,
      },
    },
  },
  required: ['inputType', 'label', 'required', 'groupId'],
}

function onSubmit() {
  if (!form.isValid.value) {
    return
  }

  const newForm = {
    ...internalValue.value,
    type: 'object',
    properties: {
      ...internalValue.value.properties,
    },
    required: [...(internalValue.value.required ?? [])],
  } satisfies ReturnType<typeof useForm>['input']
  const newKey = snakeCase(form.state.label)
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const newField: Record<string, any> = {
    name: form.state.label,
  }

  if (inputType.value === 'Text') {
    newField.type = 'string'
  }
  else if (inputType.value === 'Textarea') {
    newField.type = 'string'
    newField.attrs = {
      ...newField.attrs,
      ui: 'UTextarea',
      elementInput: {
        type: 'textarea',
        autoresize: form.state.autoresize,
        rows: form.state.rows,
        maxrows: form.state.maxrows,
      },
    }
  }
  else if (inputType.value === 'Email') {
    newField.type = 'string'
    newField.attrs = {
      ...newField.attrs,
      elementInput: {
        type: 'email',
        autocomplete: form.state.autocomplete,
      },
    }
  }
  else if (inputType.value === 'Phone') {
    newField.type = 'string'
    newField.attrs = {
      ...newField.attrs,
      pattern: form.state.pattern,
      elementInput: {
        type: 'phone',
        autocomplete: form.state.autocomplete,
      },
    }
  }
  else if (inputType.value === 'Password') {
    newField.type = 'string'
    newField.attrs = {
      ...newField.attrs,
      elementInput: {
        type: 'password',
        autocomplete: form.state.autocomplete,
      },
    }
  }
  else if (inputType.value === 'Date') {
    newField.type = 'date'
    newField.attrs = {
      ...newField.attrs,
      pattern: form.state.pattern,
      elementInput: {
        autocomplete: form.state.autocomplete,
      },
    }
  }
  else if (
    inputType.value === 'Select'
    || inputType.value === 'Yes / No'
    || inputType.value === 'Boolean'
  ) {
    newField.type = 'string'
    newField.attrs = {
      ...newField.attrs,
      ui: 'USelectMenu',
      elementInput: {
        autocomplete: form.state.autocomplete,
      },
    }
    newField.enum = inputOptions.value
  }
  else if (inputType.value === 'Quantity') {
    newField.type = 'number'
    newField.attrs = {
      ...newField.attrs,
      ui: 'USelectMenu.quantity',
      min: form.state.min,
      max: form.state.max,
    }
  }
  else if (inputType.value === 'Radio') {
    newField.type = 'string'
    newField.attrs = {
      ...newField.attrs,
      ui: 'URadioGroup',
    }
    newField.enum = inputOptions.value
  }
  else if (inputType.value === 'Checkbox') {
    newField.type = 'boolean'
  }
  else if (inputType.value === 'File' || inputType.value === 'Image') {
    newField.type = 'string'

    if (form.state.multiple) {
      newField.attrs = {
        ...newField.attrs,
        elementInput: {
          type: 'file',
          multiple: true,
        },
      }
    }
    else {
      newField.attrs = {
        ...newField.attrs,
        elementInput: {
          type: 'file',
        },
      }
    }

    if (inputType.value === 'Image') {
      newField.attrs = {
        ...newField.attrs,
        elementInput: {
          ...newField.attrs?.elementInput,
          accept: 'image/*',
        },
      }
    }
  }
  else if (inputType.value === 'Color') {
    newField.type = 'string'
    newField.attrs = {
      ...newField.attrs,
      ui: 'TColorPicker',
    }
  }
  else {
    newField.type = inputType.value.toLowerCase()
  }

  newField.attrs = {
    ...newField.attrs,
    elementInput: {
      ...newField.attrs?.elementInput,
      autocomplete: form.state.autocomplete,
    },
  }

  if (form.state.required && !newForm.required.includes(newKey)) {
    newForm.required.push(form.state.label.toLowerCase())
  }

  for (const [key, subvalue] of Object.entries(form.state)) {
    if (key === 'label' || key === 'required' || key === 'enum') {
      continue
    }

    if (
      key === 'min'
      || key === 'max'
      || key === 'minLength'
      || key === 'maxLength'
      || key === 'startsWith'
      || key === 'endsWith'
      || key === 'includes'
      || key === 'pattern'
    ) {
      newField[key] = subvalue
    }
    else {
      newField.attrs = {
        ...newField.attrs,
        [key]: subvalue,
      }
    }
  }

  newForm.properties[newKey] = newField

  internalValue.value = newForm

  inputType.value = 'Text'

  form.reset()
}

watch(
  inputType,
  (value) => {
    inputOptions.value = []
    internalDefaults.value = {
      required: true,
      order: 1,
      groupId: 'main',
    }

    let schema: Partial<ReturnType<typeof useForm>['input']> = {}

    if (value === 'Text') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          autocomplete,
          minLength: {
            type: 'number',
            name: 'Minimum length',
            min: 0,
            attrs: {
              help: 'The minimum length of the value. Should be a positive integer.',
              advanced: true,
            },
          },
          maxLength: {
            type: 'number',
            name: 'Maximum length',
            min: 0,
            attrs: {
              help: 'The maximum length of the value. Should be a positive integer.',
              advanced: true,
            },
          },
          startsWith: {
            type: 'string',
            name: 'Starts with',
            attrs: {
              help: 'What the value must start with.',
              advanced: true,
            },
          },
          endsWith: {
            type: 'string',
            name: 'Ends with',
            attrs: {
              help: 'What the value must end with.',
              advanced: true,
            },
          },
          includes: {
            type: 'string',
            name: 'Includes',
            attrs: {
              help: 'What the value must include.',
              advanced: true,
            },
          },
          pattern: {
            type: 'string',
            name: 'Pattern',
            attrs: {
              help: 'A JavaScript compatible regular expression to match.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        autocomplete: 'off',
      }
    }
    else if (value === 'Textarea') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          minLength: {
            type: 'number',
            name: 'Minimum length',
            min: 0,
            attrs: {
              help: 'The minimum length of the value. Should be a positive integer.',
              advanced: true,
            },
          },
          maxLength: {
            type: 'number',
            name: 'Maximum length',
            min: 0,
            attrs: {
              help: 'The maximum length of the value. Should be a positive integer.',
              advanced: true,
            },
          },
          startsWith: {
            type: 'string',
            name: 'Starts with',
            attrs: {
              help: 'What the value must start with.',
              advanced: true,
            },
          },
          endsWith: {
            type: 'string',
            name: 'Ends with',
            attrs: {
              help: 'What the value must end with.',
              advanced: true,
            },
          },
          includes: {
            type: 'string',
            name: 'Includes',
            attrs: {
              help: 'What the value must include.',
              advanced: true,
            },
          },
          pattern: {
            type: 'string',
            name: 'Pattern',
            attrs: {
              help: 'A JavaScript compatible regular expression to match.',
              advanced: true,
            },
          },
          autoresize: {
            type: 'boolean',
            name: 'Autoresize',
            attrs: {
              help: 'Whether the textarea should auto-resize.',
              advanced: true,
            },
          },
          rows: {
            type: 'number',
            name: 'Rows',
            min: 1,
            attrs: {
              help: 'The number of lines the input should have.',
              advanced: true,
            },
          },
          maxrows: {
            type: 'number',
            name: 'Max rows',
            min: 5,
            attrs: {
              help: 'The maximum number of lines the input should have.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        autoresize: true,
        rows: 3,
        maxrows: 3,
      }
    }
    else if (value === 'Number') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          autocomplete,
          min: {
            type: 'number',
            name: 'Min',
            min: 0,
            attrs: {
              help: 'The minimum of the value.',
              advanced: true,
            },
          },
          max: {
            type: 'number',
            name: 'Max',
            min: 0,
            attrs: {
              help: 'The maximum of the value.',
              advanced: true,
            },
          },
          multipleOf: {
            type: 'number',
            name: 'Multiple of',
            min: 0,
            attrs: {
              help: 'A number that the value must be a multiple of.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        autocomplete: 'off',
      }
    }
    else if (value === 'Email') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          autocomplete,
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        autocomplete: 'email',
      }
    }
    else if (value === 'Phone') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          autocomplete,
          pattern: {
            type: 'string',
            name: 'Pattern',
            attrs: {
              help: 'A JavaScript compatible regular expression to match.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        autocomplete: 'phone',
        pattern: '\\+1 \\(\\d{3}\\) \\d{3}-\\d{4}',
      }
    }
    else if (value === 'Password') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          autocomplete,
          minLength: {
            type: 'number',
            name: 'Minimum length',
            min: 0,
            attrs: {
              help: 'The minimum length of the value. Should be a positive integer.',
              advanced: true,
            },
          },
          pattern: {
            type: 'string',
            name: 'Pattern',
            attrs: {
              help: 'A JavaScript compatible regular expression to match.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        autocomplete: 'current-password',
      }
    }
    else if (value === 'Date') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          autocomplete,
          pattern: {
            type: 'string',
            name: 'Pattern',
            attrs: {
              help: 'A JavaScript compatible regular expression to match.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        autocomplete: 'off',
        pattern: '\\d{2}/\\d{2}/\\d{4}',
      }
    }
    else if (value === 'Yes / No') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          defaultValue: {
            type: 'string',
            name: 'Default value',
            enum: ['Yes', 'No'],
            attrs: {
              help: 'The default value of the field.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        defaultValue: 'No',
      }

      inputOptions.value = ['Yes', 'No']
    }
    else if (value === 'Quantity') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          min: {
            type: 'number',
            name: 'Min',
            min: 0,
            attrs: {
              help: 'The minimum of the value.',
            },
          },
          max: {
            type: 'number',
            name: 'Max',
            min: 1,
            attrs: {
              help: 'The maximum of the value.',
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        min: 0,
        max: 50,
      }
    }
    else if (value === 'Boolean') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          defaultValue: {
            type: 'string',
            name: 'Default value',
            enum: ['True', 'False'],
            attrs: {
              help: 'The default value of the field.',
              advanced: true,
            },
          },
        },
        required: [...formDefaults.required, 'defaultValue'],
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        defaultValue: 'False',
      }

      inputOptions.value = ['True', 'False']
    }
    else if (value === 'File') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          multiple: {
            type: 'boolean',
            name: 'Multiple',
            attrs: {
              advanced: true,
            },
          },
          accept: {
            type: 'string',
            name: 'Accept',
            attrs: {
              help: 'A comma-separated list of file types to accept.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        multiple: false,
      }
    }
    else if (value === 'Image') {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          multiple: {
            type: 'boolean',
            name: 'Multiple',
            attrs: {
              advanced: true,
            },
          },
          accept: {
            type: 'string',
            name: 'Accept',
            attrs: {
              help: 'A comma-separated list of file types to accept.',
              advanced: true,
            },
          },
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        multiple: false,
        accept: 'image/*',
      }
    }
    else if (value === 'Color') {
      schema = {
        properties: {
          colorFormat: {
            type: 'string',
            name: 'Color format',
            enum: ['All', 'Hex', 'RGB', 'RGBA', 'HSL', 'HSLA'],
            attrs: {
              help: 'Which color format to require.',
              advanced: true,
            },
          },
          hint,
          help,
          placeholder,
        },
        required: [...formDefaults.required, 'colorFormat'],
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        colorFormat: 'All',
      }
    }
    else if (value === 'Checkbox') {
      schema = {
        properties: {
          help,
        },
      }
    }
    else {
      schema = {
        properties: {
          hint,
          help,
          placeholder,
          autocomplete,
        },
      }

      internalDefaults.value = {
        ...internalDefaults.value,
        autocomplete: 'off',
      }
    }

    internalSchema.value = defu(schema, formDefaults)

    form = useForm(internalSchema.value, {
      defaults: internalDefaults.value,
    })
  },
  { immediate: true },
)
</script>
