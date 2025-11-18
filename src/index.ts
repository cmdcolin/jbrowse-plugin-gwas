import Plugin from '@jbrowse/core/Plugin'

import GWASTrackF from './GWASTrack'
import LinearManhattanDisplayF from './LinearManhattanDisplay'
import JexlMouseoverF from './LinearManhattanDisplay/jexlMouseover'
import LinearManhattanRendererF from './LinearManhattanRenderer'
import { version } from '../package.json'

import type PluginManager from '@jbrowse/core/PluginManager'

export default class GWASPlugin extends Plugin {
  name = 'GWASPlugin'
  version = version

  install(pluginManager: PluginManager) {
    GWASTrackF(pluginManager)
    LinearManhattanDisplayF(pluginManager)
    LinearManhattanRendererF(pluginManager)
    JexlMouseoverF(pluginManager)
  }
}
