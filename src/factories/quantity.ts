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
      'autocomplete': 'off',
      'min': 0,
      'max': 50,
      'field:type': 'number',
      'ui': 'USelectMenu.quantity',
    },
  ]
}
