import {
  AnyConfigurationModel,
  readConfObject,
} from '@jbrowse/core/configuration'
import {
  Feature,
  featureSpanPx,
  Region,
  updateStatus,
} from '@jbrowse/core/util'
import Flatbush from 'flatbush'

import type PluginManager from '@jbrowse/core/PluginManager'
import type WigglePlugin from '@jbrowse/plugin-wiggle'
import { checkStopToken } from './util'

interface ManhattanProps {
  features: Map<string, Feature>
  regions: Region[]
  bpPerPx: number
  statusCallback?: (arg: string) => void
  config: AnyConfigurationModel
  scaleOpts: any
  height: number
  displayCrossHatches: boolean
  ticks: { values: number[] }
  stopToken?: string
}

export default function rendererFactory(pluginManager: PluginManager) {
  const WigglePlugin = pluginManager.getPlugin('WigglePlugin') as WigglePlugin
  const {
    utils: { getScale },
    WiggleBaseRenderer,
  } = WigglePlugin.exports

  return class ManhattanPlotRenderer extends WiggleBaseRenderer {
    async draw(ctx: CanvasRenderingContext2D, props: ManhattanProps) {
      const {
        features,
        regions,
        bpPerPx,
        statusCallback = () => {},
        config,
        scaleOpts,
        height: unadjustedHeight,
        displayCrossHatches,
        ticks: { values },
        stopToken,
      } = props
      const region = regions[0]!
      const YSCALEBAR_LABEL_OFFSET = 5
      const height = unadjustedHeight - YSCALEBAR_LABEL_OFFSET * 2
      const width = (region.end - region.start) / bpPerPx

      const scale = getScale({
        ...scaleOpts,
        range: [0, height],
      })
      const toY = (n: number) => height - scale(n) + YSCALEBAR_LABEL_OFFSET

      let start = performance.now()
      checkStopToken(stopToken)
      let lastRenderedBlobX = 0
      let lastRenderedBlobY = 0
      const { isCallback } = config.color
      if (!isCallback) {
        ctx.fillStyle = config.color.value
      }
      const items: {
        minX: number
        minY: number
        maxX: number
        maxY: number
        feature: any
      }[] = []
      await updateStatus('Rendering plot', statusCallback, () => {
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
            if (isCallback) {
              ctx.fillStyle = readConfObject(config, 'color', { feature })
            }
            ctx.beginPath()
            ctx.arc(leftPx, y, 2, 0, 2 * Math.PI)
            ctx.fill()
            lastRenderedBlobY = y
            lastRenderedBlobX = leftPx
            items.push({
              minX: leftPx - 2,
              minY: y - 2,
              maxX: leftPx + 2,
              maxY: y + 2,
              feature: feature.toJSON(),
            })
          }
        }
      })
      if (displayCrossHatches) {
        ctx.lineWidth = 1
        ctx.strokeStyle = 'rgba(200,200,200,0.8)'
        values.forEach(tick => {
          ctx.beginPath()
          ctx.moveTo(0, Math.round(toY(tick)))
          ctx.lineTo(width, Math.round(toY(tick)))
          ctx.stroke()
        })
      }
      const index = new Flatbush(Math.max(items.length, 1))
      if (items.length === 0) {
        index.add(0, 0, 0, 0)
      } else {
        for (const item of items) {
          index.add(item.minX, item.minY, item.maxX, item.maxY)
        }
      }
      index.finish()
      return {
        clickMap: {
          index: index.data,
          items,
        },
      }
    }
  }
}
