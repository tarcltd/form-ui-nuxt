import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  autocomplete,
  minLength,
  maxLength,
  startsWith,
  endsWith,
  includes,
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
        maxLength,
        startsWith,
        endsWith,
        includes,
        pattern,
      },
    },
    {
      'field:type': 'Text',
      'autocomplete': 'off',
    },
  ]
}
