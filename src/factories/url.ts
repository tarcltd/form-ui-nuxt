import type { Schema } from '@tarcltd/form-vue'
import { hint, help, placeholder, autocomplete } from '../builder'

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
      'autocomplete': 'off',
      'field:type': 'url',
    },
  ]
}
