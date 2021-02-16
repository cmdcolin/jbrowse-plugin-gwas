import { types } from 'mobx-state-tree'
import { AnyConfigurationSchemaType } from '@jbrowse/core/configuration/configurationSchema'
import PluginManager from '@jbrowse/core/PluginManager'

import { linearWiggleDisplayModelFactory } from '@jbrowse/plugin-wiggle'

const stateModelFactory = (
  pluginManager: PluginManager,
  configSchema: AnyConfigurationSchemaType,
) =>
  types.compose(
    'LinearManhattanDisplay',
    linearWiggleDisplayModelFactory(pluginManager, configSchema),
    types
      .model({
        type: types.literal('LinearManhattanDisplay'),
      })
      .views(() => ({
        get rendererTypeName() {
          return 'LinearManhattanRenderer'
        },
        get needsScalebar() {
          return true
        },
      })),
  )

export type LinearManhattanDisplayModel = ReturnType<typeof stateModelFactory>

export default stateModelFactory
