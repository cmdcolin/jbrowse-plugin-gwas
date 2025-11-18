import AdapterType from '@jbrowse/core/pluggableElementTypes/AdapterType'

import GWASAdapter from './GWASAdapter'
import configSchema from './configSchema'

import type PluginManager from '@jbrowse/core/PluginManager'

export default function GWASAdapterF(pluginManager: PluginManager) {
  pluginManager.addAdapterType(
    () =>
      new AdapterType({
        name: 'GWASAdapter',
        displayName: 'GWAS adapter',
        configSchema,
        AdapterClass: GWASAdapter,
      }),
  )
}
