import ManhattanPlotRenderer from './LinearManhattanRenderer'
import LinearManhattanRendering from './LinearManhattanRendering'
import { configSchema } from './configSchema'

import type PluginManager from '@jbrowse/core/PluginManager'

export default function LinearManhattanRendererF(pluginManager: PluginManager) {
  pluginManager.addRendererType(
    () =>
      new ManhattanPlotRenderer({
        name: 'LinearManhattanRenderer',
        ReactComponent: LinearManhattanRendering,
        configSchema,
        pluginManager,
      }),
  )
}
