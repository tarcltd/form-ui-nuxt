import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  defaultValue,
  multiple,
  visible,
} from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        hint,
        help,
        placeholder,
        autocomplete,
        default: defaultValue,
        multiple,
        visible,
      },
    },
    {
      'field:type': 'Radio',
      'autocomplete': 'off',
      'multiple': false,
    },
  ]
}
