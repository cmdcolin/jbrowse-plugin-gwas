import { featureSpanPx } from '@jbrowse/core/util'
import { Feature } from '@jbrowse/core/util/simpleFeature'
import { Region } from '@jbrowse/core/util/types'
import { BaseFeatureDataAdapter } from '@jbrowse/core/data_adapters/BaseAdapter'
import { getScale, ScaleOpts, WiggleBaseRenderer } from '@jbrowse/plugin-wiggle'
import { AnyConfigurationModel } from '@jbrowse/core/configuration/configurationSchema'
import { ThemeOptions } from '@material-ui/core'

interface LinearManhattanRendererProps {
  features: Map<string, Feature>
  layout: any // eslint-disable-line @typescript-eslint/no-explicit-any
  config: AnyConfigurationModel
  regions: Region[]
  bpPerPx: number
  height: number
  width: number
  highResolutionScaling: number
  blockKey: string
  dataAdapter: BaseFeatureDataAdapter
  notReady: boolean
  scaleOpts: ScaleOpts
  sessionId: string
  signal: AbortSignal
  displayModel: unknown
  theme: ThemeOptions
}

export default class ManhattanPlotRenderer extends WiggleBaseRenderer {
  draw(ctx: CanvasRenderingContext2D, props: LinearManhattanRendererProps) {
    const { features, regions, bpPerPx, scaleOpts, height } = props
    const [region] = regions
    const opts = { ...scaleOpts, range: [0, height] }

    const viewScale = getScale(opts)
    const toY = (rawscore: number, curr = 0) =>
      height - viewScale(rawscore) - curr

    ctx.fillStyle = 'darkblue'
    for (const feature of features.values()) {
      const [leftPx] = featureSpanPx(feature, region, bpPerPx)
      const score = feature.get('score') as number
      ctx.beginPath()
      ctx.arc(leftPx, toY(score), 2, 0, 2 * Math.PI)
      ctx.fill()
    }
  }
}
