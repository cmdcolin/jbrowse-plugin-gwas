import React, { useMemo, useRef } from 'react'

import { PrerenderedCanvas } from '@jbrowse/core/ui'
import { SimpleFeature } from '@jbrowse/core/util'
import { observer } from 'mobx-react'
import RBush from 'rbush'

import type { Feature, SimpleFeatureSerialized } from '@jbrowse/core/util'
import type { Region } from '@jbrowse/core/util/types'

const LinearManhattanRendering = observer(function (props: {
  regions: Region[]
  features: Map<string, Feature>
  bpPerPx: number
  width: number
  height: number
  blockKey: string
  scaleOpts: any
  clickMap: any
  onMouseLeave?: (event: React.MouseEvent) => void
  onMouseMove?: (event: React.MouseEvent, arg?: string) => void
  onFeatureClick?: (event: React.MouseEvent, arg?: string) => void
}) {
  const { height, onMouseLeave, onMouseMove, onFeatureClick, clickMap } = props
  const clickMap2 = useMemo(() => {
    return new RBush<{ feature: SimpleFeatureSerialized }>().fromJSON(clickMap)
  }, [clickMap])
  const ref = useRef<HTMLDivElement>(null)

  function getFeatureUnderMouse(eventClientX: number, eventClientY: number) {
    // calculates feature under mouse
    let offsetX = 0
    let offsetY = 0
    if (ref.current) {
      const r = ref.current.getBoundingClientRect()
      offsetX = eventClientX - r.left
      offsetY = eventClientY - r.top
    }
    const ret = clickMap2.search({
      minX: offsetX,
      minY: offsetY,
      maxX: offsetX + 3,
      maxY: offsetY + 3,
    })
    return ret[0] ? new SimpleFeature(ret[0].feature) : undefined
  }
  return (
    <div
      ref={ref}
      data-testid="wiggle-rendering-test"
      onMouseMove={e =>
        onMouseMove?.(e, getFeatureUnderMouse(e.clientX, e.clientY)?.id())
      }
      onClick={e =>
        onFeatureClick?.(e, getFeatureUnderMouse(e.clientX, e.clientY)?.id())
      }
      onMouseLeave={e => onMouseLeave?.(e)}
      style={{
        overflow: 'visible',
        position: 'relative',
        height,
      }}
    >
      <PrerenderedCanvas {...props} />
    </div>
  )
})

export default LinearManhattanRendering
