import type { Schema } from '@tarcltd/form-vue'
import {
  hint,
  help,
  placeholder,
  minLength,
  maxLength,
  startsWith,
  endsWith,
  includes,
  pattern,
  autoresize,
  rows,
  maxrows,
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
        default: defaultValue,
        minLength,
        maxLength,
        startsWith,
        endsWith,
        includes,
        pattern,
        autoresize,
        rows,
        maxrows,
        visible,
      },
    },
    {
      'field:type': 'Textarea',
      'autoresize': true,
      'rows': 3,
      'maxrows': 3,
    },
  ]
}
