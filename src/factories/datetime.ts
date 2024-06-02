import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  pattern,
  mask,
  defaultValue,
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
        mask,
        pattern,
        visible,
      },
    },
    {
      'field:type': 'Datetime',
      'type': 'datetime',
      'autocomplete': 'off',
    },
  ]
}
