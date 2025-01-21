import React from 'react'

import { getContainingView, getEnv } from '@jbrowse/core/util'
import { observer } from 'mobx-react'

import type { LinearManhattanDisplayModel } from './model'
import type { LinearGenomeViewModel } from '@jbrowse/plugin-linear-genome-view'
import type WigglePlugin from '@jbrowse/plugin-wiggle'

const LinearGWASDisplayComponent = observer(function ({
  model,
}: {
  model: LinearManhattanDisplayModel
}) {
  const { pluginManager } = getEnv(model)
  const WigglePlugin = pluginManager.getPlugin('WigglePlugin') as WigglePlugin

  const { LinearWiggleDisplayReactComponent } = WigglePlugin.exports
  const { highScoringFeatures } = model
  const view = getContainingView(model) as LinearGenomeViewModel

  return (
    <div style={{ position: 'relative' }}>
      {highScoringFeatures.map(({ feature, y }) => {
        const ret = view.bpToPx({
          refName: feature.get('refName'),
          coord: feature.get('start'),
        })
        return ret ? (
          <div
            key={feature.id()}
            style={{
              position: 'absolute',
              left: ret.offsetPx - view.offsetPx,
              top: y,
            }}
          >
            {feature.get('name') || feature.get('rsid')}
          </div>
        ) : null
      })}
      <LinearWiggleDisplayReactComponent model={model} />
    </div>
  )
})

export default LinearGWASDisplayComponent
