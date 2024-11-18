import Plugin from '@jbrowse/core/Plugin'
import type PluginManager from '@jbrowse/core/PluginManager'
import DisplayType from '@jbrowse/core/pluggableElementTypes/DisplayType'
import rendererFactory, {
  configSchema as rendererConfigSchema,
} from './LinearManhattanRenderer'
import {
  configSchemaFactory as displayConfigSchemaFactory,
  stateModelFactory as displayModelFactory,
} from './LinearManhattanDisplay'
import type WigglePlugin from '@jbrowse/plugin-wiggle'

export default class GWASPlugin extends Plugin {
  name = 'GWASPlugin'

  install(pluginManager: PluginManager) {
    const WigglePlugin = pluginManager.getPlugin('WigglePlugin') as WigglePlugin

    const { LinearWiggleDisplayReactComponent, XYPlotRendererReactComponent } =
      WigglePlugin.exports

    pluginManager.addDisplayType(() => {
      const configSchema = displayConfigSchemaFactory(pluginManager)
      return new DisplayType({
        name: 'LinearManhattanDisplay',
        configSchema,
        stateModel: displayModelFactory(pluginManager, configSchema),
        trackType: 'FeatureTrack',
        viewType: 'LinearGenomeView',
        ReactComponent: LinearWiggleDisplayReactComponent,
      })
    })

    pluginManager.addRendererType(() => {
      // @ts-expect-error
      const ManhattanRenderer = new rendererFactory(pluginManager)
      const configSchema = rendererConfigSchema
      return new ManhattanRenderer({
        name: 'LinearManhattanRenderer',
        ReactComponent: XYPlotRendererReactComponent,
        configSchema,
        pluginManager,
      })
    })
  }
}
