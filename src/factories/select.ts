import type { Schema } from '@tarcltd/form-vue'
import { autocomplete, help, hint, placeholder } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
      },
    },
    {
      ui: 'USelectMenu',
    },
  ]
}
