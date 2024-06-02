import type { Schema } from '@tarcltd/form-vue'
import { help, defaultValue, multiple, visible } from '../builder'

export default function (): [Partial<Schema>, Record<string, unknown>] {
  return [
    {
      properties: {
        help,
        default: {
          ...defaultValue,
          type: 'boolean',
          attrs: {
            default: false,
          },
        },
        multiple,
        visible,
      },
    },
    {
      'field:type': 'Checkbox',
      'type': 'boolean',
    },
  ]
}
