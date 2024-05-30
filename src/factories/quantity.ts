import type { Schema } from '@tarcltd/form-vue'
import { help, hint, max, min, placeholder } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        min,
        max,
      },
    },
    {
      'min': 0,
      'max': 50,
      'field:type': 'number',
      'ui': 'USelectMenu.quantity',
    },
  ]
}
