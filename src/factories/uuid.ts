import type { Schema } from '@tarcltd/form-vue'
import { hint, help, placeholder, autocomplete, defaultValue, visible } from '../builder'

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
      'field:type': 'UUID',
      'type': 'uuid',
      'autocomplete': 'off',
    },
  ]
}
