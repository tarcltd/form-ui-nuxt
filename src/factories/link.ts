import type useForm from '@tarcltd/form-vue'
import type { Schema } from '@tarcltd/form-vue'

export default function (
  input?: ReturnType<typeof useForm>['input'],
): () => [Partial<Schema>, Record<string, unknown>] {
  const sources = Object.values(input?.properties ?? {}).map(field => field.name)

  return () => [
    {
      properties: {
        triggerA: {
          type: 'string',
          name: 'Trigger A',
          enum: sources,
        },
        condition: {
          type: 'string',
          name: 'Condition',
          enum: [
            'And',
            'Or',
          ],
          attrs: {
            help: 'Combine two trigger conditions using "And" or "Or". "And results in a trigger only firing if both conditions are met. "Or" results in a trigger firing if either condition is met.',
          },
        },
        triggerB: {
          type: 'string',
          name: 'Trigger A',
          enum: sources,
        },
      },
      required: ['triggerA', 'condition', 'triggerB'],
    },
    {
      'field:type': 'Link',
      'triggerA': sources[0] ?? '',
      'triggerB': sources[1] ?? '',
      'condition': 'And',
    },
  ]
}
