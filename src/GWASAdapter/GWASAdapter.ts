import { BaseFeatureDataAdapter } from '@jbrowse/core/data_adapters/BaseAdapter'
import { ObservableCreate } from '@jbrowse/core/util/rxjs'
import { Feature } from '@jbrowse/core/util'

import type { AnyConfigurationModel } from '@jbrowse/core/configuration'
import type PluginManager from '@jbrowse/core/PluginManager'
import type { BaseOptions } from '@jbrowse/core/data_adapters/BaseAdapter'
import type { NoAssemblyRegion } from '@jbrowse/core/util'

export default class GWASAdapter extends BaseFeatureDataAdapter {
  private bedTabixAdapter: BaseFeatureDataAdapter

  constructor(
    config: AnyConfigurationModel,
    getSubAdapter?: (args: unknown) => BaseFeatureDataAdapter,
    pluginManager?: PluginManager,
  ) {
    super(config, getSubAdapter, pluginManager)

    const bedTabixAdapterConfig = {
      type: 'BedTabixAdapter',
      bedGzLocation: this.getConf('bedGzLocation'),
      index: this.getConf('index'),
    }

    const adapterType = pluginManager?.getAdapterType('BedTabixAdapter')
    if (!adapterType) {
      throw new Error('BedTabixAdapter not found')
    }

    this.bedTabixAdapter = new adapterType.AdapterClass(
      bedTabixAdapterConfig,
      getSubAdapter,
      pluginManager,
    ) as BaseFeatureDataAdapter
  }

  async getRefNames(opts?: BaseOptions) {
    return this.bedTabixAdapter.getRefNames(opts)
  }

  getFeatures(region: NoAssemblyRegion, opts?: BaseOptions) {
    return ObservableCreate<Feature>(async observer => {
      const features = this.bedTabixAdapter.getFeatures(region, opts)
      features.subscribe(observer)
    }, opts?.signal)
  }

  freeResources(region: NoAssemblyRegion) {
    this.bedTabixAdapter.freeResources(region)
  }
}
