import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  minLength,
  pattern,
  defaultValue,
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
        minLength,
        pattern,
      },
    },
    {
      'autocomplete': 'current-password',
      'field:type': 'password',
    },
  ]
}
