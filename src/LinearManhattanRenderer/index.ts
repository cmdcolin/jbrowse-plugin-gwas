import rendererFactory from './LinearManhattanRenderer'
import LinearManhattanRendering from './LinearManhattanRendering'
import { configSchema } from './configSchema'

import type PluginManager from '@jbrowse/core/PluginManager'

export default function LinearManhattanRendererF(pluginManager: PluginManager) {
  pluginManager.addRendererType(() => {
    const LinearManhattanRenderer = rendererFactory(pluginManager)
    return new LinearManhattanRenderer({
      name: 'LinearManhattanRenderer',
      ReactComponent: LinearManhattanRendering,
      configSchema,
      pluginManager,
    })
  })
}
