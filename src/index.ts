import Plugin from '@jbrowse/core/Plugin'

import LinearManhattanDisplayF from './LinearManhattanDisplay'
import LinearManhattanRendererF from './LinearManhattanRenderer'

import type PluginManager from '@jbrowse/core/PluginManager'

export default class GWASPlugin extends Plugin {
  name = 'GWASPlugin'

  install(pluginManager: PluginManager) {
    LinearManhattanDisplayF(pluginManager)
    LinearManhattanRendererF(pluginManager)
  }
}
