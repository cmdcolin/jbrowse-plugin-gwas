import { DisplayType } from '@jbrowse/core/pluggableElementTypes'

import LinearGWASDisplayComponent from './LinearGWASDisplayComponent'
import { configSchemaFactory } from './configSchemaFactory'
import { stateModelFactory } from './model'

import type PluginManager from '@jbrowse/core/PluginManager'

export default function LinearManhattanDisplayF(pluginManager: PluginManager) {
  pluginManager.addDisplayType(() => {
    const configSchema = configSchemaFactory(pluginManager)
    return new DisplayType({
      name: 'LinearManhattanDisplay',
      configSchema,
      stateModel: stateModelFactory(pluginManager, configSchema),
      trackType: 'FeatureTrack',
      viewType: 'LinearGenomeView',
      ReactComponent: LinearGWASDisplayComponent,
    })
  })
}
