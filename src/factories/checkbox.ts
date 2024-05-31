import type { Schema } from '@tarcltd/form-vue'
import { help, defaultValue } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        help,
        default: {
          ...defaultValue,
          attrs: {
            default: false,
          },
        },
      },
    },
    {
      'field:type': 'boolean',
      'ui': 'UCheckbox',
    },
  ]
}
