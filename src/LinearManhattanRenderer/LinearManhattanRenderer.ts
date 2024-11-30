import { readConfObject } from '@jbrowse/core/configuration'
import { featureSpanPx } from '@jbrowse/core/util'
import RBush from 'rbush'

import type PluginManager from '@jbrowse/core/PluginManager'
import type WigglePlugin from '@jbrowse/plugin-wiggle'

export function checkStopToken(stopToken?: string) {
  if (stopToken !== undefined) {
    const xhr = new XMLHttpRequest()

    // synchronous XHR usage to check the token
    xhr.open('GET', stopToken, false)
    try {
      xhr.send(null)
    } catch (e) {
      throw new Error('aborted')
    }
  }
}

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin('WigglePlugin') as WigglePlugin
  const {
    utils: { getScale },
    WiggleBaseRenderer,
  } = WigglePlugin.exports

  return class ManhattanPlotRenderer extends WiggleBaseRenderer {
    async draw(ctx: CanvasRenderingContext2D, props: any) {
      const {
        features,
        regions,
        bpPerPx,
        config,
        scaleOpts,
        height: unadjustedHeight,
        displayCrossHatches,
        ticks: { values },
        stopToken,
      } = props
      const [region] = regions
      const YSCALEBAR_LABEL_OFFSET = 5
      const height = unadjustedHeight - YSCALEBAR_LABEL_OFFSET * 2
      const opts = { ...scaleOpts, range: [0, height] }
      const width = (region.end - region.start) / bpPerPx
      const rbush = new RBush<any>()

      const defaultColor = readConfObject(config, 'color')
      const scale = getScale(opts)
      const toY = (n: number) => height - scale(n) + YSCALEBAR_LABEL_OFFSET

      let start = performance.now()
      checkStopToken(stopToken)
      let lastRenderedBlobX = 0
      let lastRenderedBlobY = 0
      if (!config.color.isCallback) {
        ctx.fillStyle = defaultColor
      }
      for (const feature of features.values()) {
        if (performance.now() - start > 200) {
          checkStopToken(stopToken)
          start = performance.now()
        }
        const [leftPx] = featureSpanPx(feature, region, bpPerPx)
        const score = feature.get('score') as number
        const y = toY(score)
        if (
          Math.abs(leftPx - lastRenderedBlobX) > 1 ||
          Math.abs(y - lastRenderedBlobY) > 1
        ) {
          if (config.color.isCallback) {
            ctx.fillStyle = readConfObject(config, 'color', { feature })
          }
          ctx.beginPath()
          ctx.moveTo(leftPx, y)
          ctx.arc(leftPx, y, 2, 0, 2 * Math.PI)
          ctx.fill()
          lastRenderedBlobY = y
          lastRenderedBlobX = leftPx
          rbush.insert({
            minX: leftPx,
            minY: y,
            maxX: leftPx + 4,
            maxY: y + 4,
            feature: feature.toJSON(),
          })
        }
      }

      if (displayCrossHatches) {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(200,200,200,0.8)'
        values.forEach((tick: number) => {
          ctx.beginPath()
          ctx.moveTo(0, Math.round(toY(tick)))
          ctx.lineTo(width, Math.round(toY(tick)))
          ctx.stroke()
        })
      }
      return {
        clickMap: rbush.toJSON(),
      }
    }
  }
}
