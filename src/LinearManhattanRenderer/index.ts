import { ConfigurationSchema } from '@jbrowse/core/configuration'
import LinearManhattanRendering from './LinearManhattanRendering'

import type PluginManager from '@jbrowse/core/PluginManager'

const configSchema = ConfigurationSchema(
  'LinearManhattanRenderer',
  {
    /**
     * #slot
     */
    color: {
      type: 'color',
      description: 'the color of the marks',
      defaultValue: 'darkblue',
      contextVariable: ['feature'],
    },
  },
  { explicitlyTyped: true },
)

export default function LinearManhattanRendererF(pluginManager: PluginManager) {
  pluginManager.addRendererType(() => {
    // @ts-expect-error
    const LinearManhattanRenderer = new rendererFactory(pluginManager)
    return new LinearManhattanRenderer({
      name: 'LinearManhattanRenderer',
      ReactComponent: LinearManhattanRendering,
      configSchema,
      pluginManager,
    })
  })
}
