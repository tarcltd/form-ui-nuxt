import {
  addComponentsDir,
  addImports,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'
import { defu } from 'defu'

export interface ModuleOptions {
  inputTypes?: string[]
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'form-ui-nuxt',
    configKey: 'formUiNuxt',
  },
  defaults: {
    inputTypes: [
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
      'Trigger',
      'URL',
      'UUID',
    ],
  },
  async setup(options, nuxt) {
    nuxt.options.runtimeConfig.public.formUiNuxt = defu(
      nuxt.options.runtimeConfig.public.formUiNuxt ?? {},
      {
        inputTypes: options.inputTypes ?? [],
      },
    )

    const resolver = createResolver(import.meta.url)

    await addComponentsDir({
      path: resolver.resolve('./components'),
      extensions: ['vue'],
    })

    addImports([
      {
        name: 'default',
        as: 'useForm',
        from: '@tarcltd/form-vue',
      },
      {
        name: 'FormReturnType',
        type: true,
        from: '@tarcltd/form-vue',
      },
      {
        name: 'Schema',
        type: true,
        from: '@tarcltd/form-vue',
      },
      {
        name: 'SchemaObject',
        type: true,
        from: '@tarcltd/form-vue',
      },
      {
        name: 'SchemaField',
        type: true,
        from: '@tarcltd/form-vue',
      },
      {
        name: 'SchemaFieldType',
        type: true,
        from: '@tarcltd/form-vue',
      },
    ])
  },
})
