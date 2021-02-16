import { ConfigurationSchema } from '@jbrowse/core/configuration'

export default ConfigurationSchema(
  'LinearManhattanRenderer',
  {
    color: {
      type: 'color',
      description: 'the color of the marks',
      defaultValue: 'red',
    },
  },
  { explicitlyTyped: true },
)
