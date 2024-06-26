import type { Schema } from '@tarcltd/form-vue'
import { autocomplete, defaultValue, help, hint, placeholder, visible } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
        default: defaultValue,
        visible,
      },
    },
    {
      'field:type': 'Select',
    },
  ]
}
