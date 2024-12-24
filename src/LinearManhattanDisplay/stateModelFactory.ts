import {
  getContainingTrack,
  getContainingView,
  getSession,
  isSelectionContainer,
  isSessionModelWithWidgets,
} from '@jbrowse/core/util'

import TooltipComponent from './TooltipComponent'

import type PluginManager from '@jbrowse/core/PluginManager'
import type { Feature } from '@jbrowse/core/util'
import type WigglePlugin from '@jbrowse/plugin-wiggle'

import type { MenuItem } from '@jbrowse/core/ui'
import { lazy } from 'react'
const AddFiltersDialog = lazy(() => import('./AddFiltersDialog'))
import { cast, getEnv, types } from 'mobx-state-tree'

import { ConfigurationReference, getConf } from '@jbrowse/core/configuration'
import SerializableFilterChain from '@jbrowse/core/pluggableElementTypes/renderers/util/serializableFilterChain'

export function stateModelFactory(
  pluginManager: PluginManager,
  configSchema: any,
) {
  const { types } = pluginManager.lib['mobx-state-tree']
  const WigglePlugin = pluginManager.getPlugin('WigglePlugin') as WigglePlugin
  const { linearWiggleDisplayModelFactory } = WigglePlugin.exports
  return types.compose(
    'LinearManhattanDisplay',
    linearWiggleDisplayModelFactory(pluginManager, configSchema),
    types
      .model({
        type: types.literal('LinearManhattanDisplay'),
        /**
         * #property
         */
        configuration: ConfigurationReference(configSchema),
        /**
         * #property
         */
        jexlFilters: types.maybe(types.array(types.string)),
      })
      .views(self => {
        const {
          trackMenuItems: superTrackMenuItems,
          renderProps: superRenderProps,
        } = self
        return {
        get TooltipComponent() {
          return TooltipComponent
        },
        get rendererTypeName() {
          return 'LinearManhattanRenderer'
        },
        get needsScalebar() {
          return true
        },
        get regionTooLarge() {
          return false
        },
        /**
         * #getter
         */
        get activeFilters() {
          // config jexlFilters are deferred evaluated so they are prepended with
          // jexl at runtime rather than being stored with jexl in the config
          return (
            self.jexlFilters ??
            getConf(self, 'jexlFilters').map((r: string) => `jexl:${r}`)
          )
        },
        /**
         * #method
         */
        renderProps() {
          const superProps = superRenderProps()
          return {
            ...(superProps as Omit<typeof superProps, symbol>),
            config: self.rendererConfig,
            filters: new SerializableFilterChain({
              filters: self.activeFilters,
            }),
          }
        },
        /**
         * #method
         */
        trackMenuItems(): MenuItem[] {
          return [
            ...superTrackMenuItems(),
            {
              label: 'Edit filters',
              onClick: () => {
                let arr = ['a', 'b', 'c']
                console.log(arr.includes('a'))
                console.log(arr.includes('z'))
                getSession(self).queueDialog(handleClose => [
                  AddFiltersDialog,
                  { model: self, handleClose },
                ])
              },
            },
          ]
        },
      }})
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
        setJexlFilters(f?: string[]) {
          self.jexlFilters = cast(f)
        },
      })),
  )
}

export type LinearManhattanDisplayModel = ReturnType<typeof stateModelFactory>
