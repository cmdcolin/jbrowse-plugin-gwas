import {
  SimpleFeature,
  getContainingTrack,
  getContainingView,
  getSession,
  isSelectionContainer,
  isSessionModelWithWidgets,
} from '@jbrowse/core/util'
import { observable } from 'mobx'
import { types } from 'mobx-state-tree'

import TooltipComponent from './TooltipComponent'

import type PluginManager from '@jbrowse/core/PluginManager'
import type { AnyConfigurationSchemaType } from '@jbrowse/core/configuration'
import type { Feature, SimpleFeatureSerialized } from '@jbrowse/core/util'
import type WigglePlugin from '@jbrowse/plugin-wiggle'
import type { Instance } from 'mobx-state-tree'
import type RBush from 'rbush'

type BlockClickMap = RBush<{
  feature: SimpleFeatureSerialized
  minY: number
}>

export function stateModelFactory(
  pluginManager: PluginManager,
  configSchema: AnyConfigurationSchemaType,
) {
  const WigglePlugin = pluginManager.getPlugin('WigglePlugin') as WigglePlugin
  const { linearWiggleDisplayModelFactory } = WigglePlugin.exports
  return types.compose(
    'LinearManhattanDisplay',
    linearWiggleDisplayModelFactory(pluginManager, configSchema),
    types
      .model({
        /**
         * #property
         */
        type: types.literal('LinearManhattanDisplay'),
      })
      .volatile(() => ({
        /**
         * #volatile
         */
        displayClickMaps: observable.map<string, BlockClickMap>(),
      }))
      .views(() => ({
        /**
         * #getter
         */
        get TooltipComponent() {
          return TooltipComponent
        },

        /**
         * #getter
         */
        get rendererTypeName() {
          return 'LinearManhattanRenderer'
        },

        /**
         * #getter
         */
        get needsScalebar() {
          return true
        },

        /**
         * #getter
         */
        get regionTooLarge() {
          return false
        },
      }))
      .actions(self => ({
        /**
         * #action
         * this overrides the BaseLinearDisplayModel to avoid popping up a
         * feature detail display, but still sets the feature selection on the
         * model so listeners can detect a click
         */
        selectFeature(feature: Feature) {
          const session = getSession(self)
          if (isSessionModelWithWidgets(session)) {
            const featureWidget = session.addWidget(
              'BaseFeatureWidget',
              'baseFeature',
              {
                view: getContainingView(self),
                track: getContainingTrack(self),
                featureData: feature.toJSON(),
              },
            )

            session.showWidget(featureWidget)
          }
          if (isSelectionContainer(session)) {
            session.setSelection(feature)
          }
        },
        /**
         * #action
         */
        setBlockClickMap(blockKey: string, clickMap: BlockClickMap) {
          self.displayClickMaps.set(blockKey, clickMap)
        },
        /**
         * #action
         */
        removeBlockClickMap(blockKey: string) {
          self.displayClickMaps.delete(blockKey)
        },
      }))
      .views(self => ({
        /**
         * #getter
         */
        get highScoringFeatures() {
          const ret = [] as { feature: Feature; y: number }[]
          for (const clickMap of self.displayClickMaps.values()) {
            for (const entry of clickMap.all()) {
              if (entry.feature.score > 30) {
                ret.push({
                  feature: new SimpleFeature(entry.feature),
                  y: entry.minY,
                })
              }
            }
          }
          return ret
        },
      })),
  )
}

export type LinearManhattanDisplayStateModel = ReturnType<
  typeof stateModelFactory
>
export type LinearManhattanDisplayModel =
  Instance<LinearManhattanDisplayStateModel>
