import { lazy } from 'react'

import type PluginManager from '@jbrowse/core/PluginManager'

const GWASAddTrackComponent = lazy(() => import('./GWASAddTrackComponent'))

export default function GWASAddTrackComponentF(
  pluginManager: PluginManager,
) {
  pluginManager.addToExtensionPoint(
    'Core-addTrackComponent',
    // @ts-expect-error
    (comp, { model }: { trackAdapterType: string }) => {
      return model.trackAdapterType === 'GWASAdapter'
        ? GWASAddTrackComponent
        : comp
    },
  )
}
