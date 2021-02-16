import { ConfigurationSchema } from '@jbrowse/core/configuration'
import ConfigSchema from './configSchema'

export { WiggleRendering as ReactComponent } from '@jbrowse/plugin-wiggle'
export { default } from './LinearManhattanRenderer'

export const configSchema = ConfigurationSchema(
  'LinearManhattanRenderer',
  {},
  { baseConfiguration: ConfigSchema, explicitlyTyped: true },
)
