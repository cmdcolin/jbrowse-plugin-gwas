import Plugin from '@jbrowse/core/Plugin'

import LinearManhattanDisplayF from './LinearManhattanDisplay'
import LinearManhattanRendererF from './LinearManhattanRenderer'
import { version } from '../package.json'

import type PluginManager from '@jbrowse/core/PluginManager'

export default class GWASPlugin extends Plugin {
  name = 'GWASPlugin'
  version = version

  install(pluginManager: PluginManager) {
    LinearManhattanDisplayF(pluginManager)
    LinearManhattanRendererF(pluginManager)
  }
}
