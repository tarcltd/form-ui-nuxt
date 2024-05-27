import {
  addComponentsDir,
  addImports,
  createResolver,
  defineNuxtModule,
} from '@nuxt/kit'

export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'form-ui-nuxt',
    configKey: 'formUiNuxt',
  },
  defaults: {},
  async setup(_options, _nuxt) {
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
