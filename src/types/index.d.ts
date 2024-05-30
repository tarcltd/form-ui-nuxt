declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    formUiNuxt: {
      inputTypes?: string[]
    }
  }
}
// It is always important to ensure you import/export something when augmenting a type
export {}
