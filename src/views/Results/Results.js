import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

// Styles
import {
  ResultsTable,
  ResultsWrapper
} from './Results.styles'

const Results = ({ data }) => {
  if (!data || !data.totalActors) {
    return <div />
  }

  const winner = data.avgLifeTotals.Hawk > data.avgLifeTotals.Dove ? 'Hawks' : 'Doves'
  const loser = data.avgLifeTotals.Hawk > data.avgLifeTotals.Dove ? 'Doves' : 'Hawks'
  const winningMargin = Math.abs(data.avgLifeTotals.Hawk - data.avgLifeTotals.Dove)
  const winningMarginText = winningMargin > 10 ? 'significantly' : ''

  return (
    <ResultsWrapper>
      <h3>{data.totalActors.Dove} Doves vs {data.totalActors.Hawk} Hawks</h3>
      <ResultsTable>
        <thead>
          <tr>
            <th>Actor</th>
            <th>Encounters</th>
            <th>Fights</th>
            <th>Meals (Unchallenged)</th>
            <th>Life Exp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Dove</td>
            <td>{data.encounters.DoveDove}</td>
            <td>-</td>
            <td>{data.wins.Dove + data.unchallenged.Dove} ({data.unchallenged.Dove})</td>
            <td>{_.round(data.avgLifeTotals.Dove, 1)}</td>
          </tr>
          <tr>
            <td>Hawk</td>
            <td>{data.encounters.HawkHawk + data.encounters.DoveHawk}</td>
            <td>{data.encounters.HawkHawk}</td>
            <td>{data.wins.Hawk + data.unchallenged.Hawk} ({data.unchallenged.Hawk})</td>
            <td>{_.round(data.avgLifeTotals.Hawk, 1)}</td>
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
      <h3>Analysis</h3>
      <p>{winner} survive {winningMarginText} longer than {loser} in this environment.</p>
      <p>Hawks are each experiencing {_.round(data.avgDamage, 1)} damage, each.</p>
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
