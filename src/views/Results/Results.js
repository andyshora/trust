import React from 'react'
import PropTypes from 'prop-types'

// Styles
import {
  ResultsTable,
  ResultsWrapper
} from './Results.styles'

const Results = ({ data }) => {
  if (!data || !data.totalActors) {
    return <div />
  }
  return (
    <ResultsWrapper>
      <h3>{data.totalActors.Dove} Doves vs {data.totalActors.Hawk} Hawks</h3>
      <ResultsTable>
        <thead>
          <tr>
            <th>Actor</th>
            <th>Encounters</th>
            <th>Won (Unchallenged)</th>
            <th>Fights</th>
            <th>Life Exp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dove</td>
            <td>{data.encounters.DoveDove}</td>
            <td>{data.wins.Dove + data.unchallenged.Dove} ({data.unchallenged.Dove})</td>
            <td>-</td>
            <td>{data.avgLifeTotals.Dove}</td>
          </tr>
          <tr>
            <td>Hawk</td>
            <td>{data.encounters.HawkHawk + data.encounters.DoveHawk}</td>
            <td>{data.wins.Hawk + data.unchallenged.Hawk} ({data.unchallenged.Hawk})</td>
            <td>{data.encounters.HawkHawk}</td>
            <td>{data.avgLifeTotals.Hawk}</td>
          </tr>
        </tbody>
      </ResultsTable>
      <h3>Encounters</h3>
      <ResultsTable>
        <thead>
          <tr>
            <th>Hawk-Hawk</th>
            <th>Hawk-Dove</th>
            <th>Dove-Dove</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{data.encounters.HawkHawk}</td>
            <td>{data.encounters.DoveHawk}</td>
            <td>{data.encounters.DoveDove}</td>
          </tr>
        </tbody>
      </ResultsTable>
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
