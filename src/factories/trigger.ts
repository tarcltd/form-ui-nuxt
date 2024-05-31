import type { Schema } from '@tarcltd/form-vue'

export default function (
  sources: string[],
): () => [Partial<Schema>, Record<string, unknown>] {
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
      'field:type': 'trigger',
      'type': 'trigger',
      'source': sources[0] ?? '',
      'condition': 'Equals',
    },
  ]
}
