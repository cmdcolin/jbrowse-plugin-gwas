import React, { useEffect, useState } from 'react'

import { TextField } from '@mui/material'
import { observer } from 'mobx-react'

const GWASAddTrackComponent = observer(function ({ model }: any) {
  const [scoreColumn, setScoreColumn] = useState('neg_log_pvalue')

  useEffect(() => {
    model.setMixinData({
      adapter: {
        scoreColumn,
      },
    })
  }, [model, scoreColumn])

  return (
    <TextField
      label="Score column"
      helperText="Name of the column to use as the score for the Manhattan plot (e.g., 'neg_log_pvalue', 'pvalue')"
      value={scoreColumn}
      onChange={event => {
        setScoreColumn(event.target.value)
      }}
      fullWidth
    />
  )
})

export default GWASAddTrackComponent
