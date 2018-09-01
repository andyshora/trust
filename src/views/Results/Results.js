import React from 'react'
import PropTypes from 'prop-types'

// Styles
import { ResultsWrapper } from './Results.styles'

const Results = ({ data }) => {
  return (
    <ResultsWrapper>
      {data.map(d => <p>{d.actor}: {d.lifeAverage}</p>)}
    </ResultsWrapper>
  )
}

Results.propTypes = {
  data: PropTypes.object
}

Results.defaultProps = {
  data: null
}

export default Results
