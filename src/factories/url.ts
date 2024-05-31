import type { Schema } from '@tarcltd/form-vue'
import { hint, help, placeholder, autocomplete, defaultValue } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
        default: defaultValue,
      },
    },
    {
      'autocomplete': 'off',
      'field:type': 'url',
    },
  ]
}