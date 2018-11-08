import React, { Component } from 'react'
import ContainerDimensions from 'react-container-dimensions'
import keydown from 'react-keydown'

// Views
import ActorIntro from '../ActorIntro'
import Results from '../Results'

// Views
import NaturalSystem from '../../systems/NaturalSystem'

// Styles
import '../../styles/generic'
import {
  ResultsTable,
  ResultsTableRow,
  ReceivedCell,
  SentCell,
  AppWrapper,
  NavWrapper,
  ResultsWrap,
  SystemViz,
  SystemWrapper,
  HealthSwatch
} from './App.styles'

const COPY = {
  Dove: [
    {
      heading: 'The Dove',
      lines: ['Doves are passive, and don\'t like to fight.']
    },
    {
      heading: 'Dove Strategy: Share, don\'t fight.',
      lines: [
        // 'They would rather forfeit resources to stronger opposition, and not risk losing cost C to gain resource G.',
        // 'They\'ll happily take G if there is no cost C to lose, which only happens if they face no opposition or encounter another Dove.',
        'Posture until the other withdraws.',
        'Withdraw if the other escalates or seems too strong.'
      ]
    },
    {
      heading: 'Dove v Dove',
      lines: [
        'Doves don\'t fight. One Dove will win. Neither get hurt.',
        'Average gain for each dove: G / 2'
      ]
    }
  ],
  Hawk: [
    {
      heading: 'The Hawk',
      lines: ['Hawks are aggressive. They\'ll happily fight for food.']
    },
    {
      heading: 'Hawk Strategy: Escalate, fight if necessary.',
      lines: [
        'Always escalate the conflict until either the other withdraws',
        'If posturing fails, then fight.'
      ]
    },
    {
      heading: 'Hawk v Hawk',
      lines: [
        'Always escalate the conflict until either the other withdraws',
        'If the opposition does not withdraw, you are badly hurt.',
        'Average gain for each hawk: G / 2',
        'Average Cost to each Hawk: C / 2'
      ]
    }
  ],
  DoveHawk: [
    {
      heading: 'Hawk vs Dove',
      lines: [
        'Hawks escalate the conflict to win. Doves withdraw, empty-handed.',
        'Average gain for each Hawk: G'
      ]
    }
  ]
}

const STAGES = [
  { type: 'system', systemType: 'bats', stage: 0 },
  { type: 'system', systemType: 'bats', stage: 1 }
]

class App extends Component {
  constructor(props) {
    super(props)
    this.system = React.createRef()

    this._onResetTapped = this._onResetTapped.bind(this)
  }
  state = {
    activeStage: STAGES[0],
    prevStage: -1,
    stage: 0,
    systemResults: {}
  }
  @keydown('right')
  nextStage() {
    const { stage } = this.state
    if (stage === STAGES.length - 1) {
      return
    }
    this.setState({
      activeStage: STAGES[stage + 1],
      stage: stage + 1,
      prevStage: stage,
      systemResults: {}
    })
  }
  @keydown('left')
  prevStage() {
    const { stage } = this.state
    if (!stage) {
      return
    }
    this.setState({
      activeStage: STAGES[stage - 1],
      stage: stage - 1,
      prevStage: stage,
      systemResults: {}
    })
  }
  _onResetTapped() {
    if (this.system.current && typeof this.system.current.reset === 'function') {
      this.system.current.reset()
    }
  }
  _handleSystemResultsChange = data => {
    this.setState({
      systemResults: data
    })
  }
  render() {
    const {
      activeStage,
      prevStage,
      stage,
      systemResults
    } = this.state
    const copy = COPY[activeStage.copyKey]
    return (
      <AppWrapper>
        {activeStage.type === 'system'
          ? (
            <SystemWrapper>
              <SystemViz>
                <ContainerDimensions>
                  {({ height, width }) => (
                    <NaturalSystem
                      height={height}
                      width={width}
                      resultsCallback={this._handleSystemResultsChange}
                      ref={this.system}
                      type={activeStage.systemType} />
                  )}
                </ContainerDimensions>
              </SystemViz>
              <ResultsWrap>
                <ResultsTable>
                  <thead>
                    <tr>
                      <td>ID</td>
                      <td>Health</td>
                      <td>Sent</td>
                      <td>Recd</td>
                    </tr>
                  </thead>
                  {systemResults && systemResults.bats && systemResults.bats.sort((a, b) => b.life - a.life).map(b => (
                    <ResultsTableRow key={b.id} active={!!b.life}>
                      <td>{b.id}</td>
                      <td><HealthSwatch health={b.life / 120} />{b.life}</td>
                      <SentCell opacity={Math.min(b.sent / 3, 1)}><span>{b.sent}</span></SentCell>
                      <ReceivedCell opacity={Math.min(b.received / 3, 1)}><span>{b.received}</span></ReceivedCell>
                    </ResultsTableRow>
                  ))}
                </ResultsTable>
              </ResultsWrap>
            </SystemWrapper>
          )
          : <ContainerDimensions>
            {({ height, width }) => (
              <ActorIntro
                height={height}
                names={activeStage.names}
                copy={copy}
                prevStage={prevStage % 3}
                stage={stage % 3}
                width={width} />
            )}
          </ContainerDimensions>
        }
      </AppWrapper>
    )
  }
}

export default App
