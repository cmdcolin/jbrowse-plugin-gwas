import React from 'react'

import { Tooltip } from '@jbrowse/plugin-wiggle'
import { observer } from 'mobx-react'

import type { Feature } from '@jbrowse/core/util'
import type { TooltipContentsComponent } from '@jbrowse/plugin-wiggle'

const en = (n: number) => n.toLocaleString('en-US')

function toP(s = 0) {
  return +(+s).toPrecision(6)
}
interface Props {
  feature: Feature
}

const TooltipContents = React.forwardRef<HTMLDivElement, Props>(
  function TooltipContents2({ feature }, ref) {
    const start = feature.get('start') + 1
    const end = feature.get('end')
    const refName = feature.get('refName')
    const name = feature.get('name')
    const rsid = feature.get('rsid')
    const loc = [
      refName,
      start === end ? en(start) : `${en(start)}..${en(end)}`,
    ]
      .filter(f => !!f)
      .join(':')

    return (
      <div ref={ref}>
        {loc}
        <br />
        {`${toP(feature.get('score'))}`}
        <br />
        {name || rsid}
      </div>
    )
  },
)

type Coord = [number, number]

const TooltipComponent = observer(function (props: {
  model: {
    featureUnderMouse?: Feature
  }
  height: number
  offsetMouseCoord: Coord
  clientMouseCoord: Coord
  clientRect?: DOMRect
  TooltipContents?: TooltipContentsComponent
}) {
  return <Tooltip TooltipContents={TooltipContents} {...props} />
})

export default TooltipComponent
