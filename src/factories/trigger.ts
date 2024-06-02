import type useForm from '@tarcltd/form-vue'
import type { Schema } from '@tarcltd/form-vue'

export default function (
  input?: ReturnType<typeof useForm>['input'],
): () => [Partial<Schema>, Record<string, unknown>] {
  const sources = Object.values(input?.properties ?? {}).map(field => field.name)

  return () => [
    {
      properties: {
        source: {
          type: 'string',
          name: 'Source',
          enum: sources,
          attrs: {
            help: 'The source field of the trigger.',
          },
        },
        condition: {
          type: 'string',
          name: 'Condition',
          enum: [
            'Equals',
            'Not equals',
            'Greater than',
            'Less than',
            'Greater than or equal',
            'Less than or equal',
            'Contains',
            'Not contains',
            'Starts with',
            'Ends with',
            'Matches',
            'Does not match',
            'Empty',
            'Not empty',
            'Truthy',
            'Falsy',
          ],
          attrs: {
            help: 'An operation to perform on the source value.',
          },
        },
        value: {
          type: 'string',
          name: 'Value',
          attrs: {
            'field:type': 'trigger:value',
            'help': 'The value to compare the source value to.',
          },
        },
      },
      required: ['source', 'condition', 'value'],
    },
    {
      'field:type': 'Trigger',
      'source': sources[0] ?? '',
      'condition': 'Equals',
    },
  ]
}
