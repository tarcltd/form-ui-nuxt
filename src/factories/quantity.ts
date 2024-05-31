import type { Schema } from '@tarcltd/form-vue'
import { autocomplete, defaultValue, help, hint, max, min, placeholder } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
        default: defaultValue,
        min,
        max,
      },
    },
    {
      'field:type': 'Quantity',
      'type': 'number',
      'autocomplete': 'off',
      'min': 0,
      'max': 50,
    },
  ]
}
