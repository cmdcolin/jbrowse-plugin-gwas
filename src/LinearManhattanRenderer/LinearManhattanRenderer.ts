import FeatureRendererType from '@jbrowse/core/pluggableElementTypes/renderers/FeatureRendererType'
import {
  AnyConfigurationModel,
  readConfObject,
} from '@jbrowse/core/configuration'
import {
  Feature,
  Region,
  renderToAbstractCanvas,
  updateStatus,
} from '@jbrowse/core/util'
import { getScale } from '@jbrowse/plugin-wiggle'
import Flatbush from 'flatbush'

import { checkStopToken } from './util'

const TWO_PI = Math.PI * 2
const YSCALEBAR_LABEL_OFFSET = 5
const POINT_RADIUS = 2

interface ManhattanRenderProps {
  features: Map<string, Feature>
  regions: Region[]
  bpPerPx: number
  statusCallback?: (arg: string) => void
  config: AnyConfigurationModel
  scaleOpts: {
    domain: number[]
    scaleType: string
    pivotValue?: number
    inverted?: boolean
  }
  height: number
  displayCrossHatches: boolean
  ticks: { values: number[] }
  stopToken?: string
  highResolutionScaling?: number
}

export default class ManhattanPlotRenderer extends FeatureRendererType {
  supportsSVG = true

  async render(renderProps: ManhattanRenderProps) {
    const features = await this.getFeatures(renderProps)
    const { height, regions, bpPerPx, statusCallback = () => {} } = renderProps

    const region = regions[0]!
    const width = (region.end - region.start) / bpPerPx

    const { reducedFeatures, ...rest } = await updateStatus(
      'Rendering plot',
      statusCallback,
      () =>
        renderToAbstractCanvas(width, height, renderProps, ctx =>
          this.draw(ctx, {
            ...renderProps,
            features,
          }),
        ),
    )

    const results = await super.render({
      ...renderProps,
      ...rest,
      features,
      height,
      width,
    })

    return {
      ...results,
      ...rest,
      features: reducedFeatures
        ? new Map<string, Feature>(reducedFeatures.map(r => [r.id(), r]))
        : results.features,
      height,
      width,
      containsNoTransferables: true,
    }
  }

  draw(
    ctx: CanvasRenderingContext2D,
    props: ManhattanRenderProps & { features: Map<string, Feature> },
  ) {
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
    const region = regions[0]!
    const height = unadjustedHeight - YSCALEBAR_LABEL_OFFSET * 2
    const width = (region.end - region.start) / bpPerPx
    const pxPerBp = 1 / bpPerPx
    const regionStart = region.start

    const scale = getScale({
      ...scaleOpts,
      range: [0, height],
    })
    const yOffset = height + YSCALEBAR_LABEL_OFFSET
    const toY = (n: number) => yOffset - scale(n)

    const { isCallback } = config.color
    const colorValue = config.color.value as string
    const canBatch =
      !isCallback &&
      !colorValue.includes('rgba') &&
      !colorValue.includes('hsla')
    const items: {
      minX: number
      minY: number
      maxX: number
      maxY: number
      feature: any
    }[] = []

    let lastRenderedBlobX = 0
    let lastRenderedBlobY = 0
    let start = performance.now()
    let i = 0

    if (canBatch) {
      ctx.fillStyle = colorValue
      ctx.beginPath()
      for (const feature of features.values()) {
        if (i++ % 100 === 0 && performance.now() - start > 200) {
          checkStopToken(stopToken)
          start = performance.now()
        }
        const leftPx = (feature.get('start') - regionStart) * pxPerBp
        const y = toY(feature.get('score'))
        if (
          Math.abs(leftPx - lastRenderedBlobX) > 1 ||
          Math.abs(y - lastRenderedBlobY) > 1
        ) {
          ctx.moveTo(leftPx + POINT_RADIUS, y)
          ctx.arc(leftPx, y, POINT_RADIUS, 0, TWO_PI)
          lastRenderedBlobY = y
          lastRenderedBlobX = leftPx
          items.push({
            minX: leftPx - POINT_RADIUS,
            minY: y - POINT_RADIUS,
            maxX: leftPx + POINT_RADIUS,
            maxY: y + POINT_RADIUS,
            feature: feature.toJSON(),
          })
        }
      }
      ctx.fill()
    } else {
      if (!isCallback) {
        ctx.fillStyle = colorValue
      }
      for (const feature of features.values()) {
        if (i++ % 100 === 0 && performance.now() - start > 200) {
          checkStopToken(stopToken)
          start = performance.now()
        }
        const leftPx = (feature.get('start') - regionStart) * pxPerBp
        const y = toY(feature.get('score'))
        if (
          Math.abs(leftPx - lastRenderedBlobX) > 1 ||
          Math.abs(y - lastRenderedBlobY) > 1
        ) {
          if (isCallback) {
            ctx.fillStyle = readConfObject(config, 'color', { feature })
          }
          ctx.beginPath()
          ctx.arc(leftPx, y, POINT_RADIUS, 0, TWO_PI)
          ctx.fill()
          lastRenderedBlobY = y
          lastRenderedBlobX = leftPx
          items.push({
            minX: leftPx - POINT_RADIUS,
            minY: y - POINT_RADIUS,
            maxX: leftPx + POINT_RADIUS,
            maxY: y + POINT_RADIUS,
            feature: feature.toJSON(),
          })
        }
      }
    }

    if (displayCrossHatches) {
      ctx.lineWidth = 1
      ctx.strokeStyle = 'rgba(200,200,200,0.8)'
      ctx.beginPath()
      for (const tick of values) {
        const y = Math.round(toY(tick))
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
      }
      ctx.stroke()
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
