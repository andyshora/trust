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
  AppWrapper,
  NavWrapper,
  SystemSidebar,
  SystemViz,
  SystemWrapper
} from './App.styles'

const COPY = {
  Dove: [
    {
      heading: 'The Dove',
      lines: ['Doves are passive, and don\'t like to fight.']
    },
    {
      heading: 'Doves Cooperate',
      lines: [
        'They would rather forfeit resources to stronger opposition, and not risk losing cost C to gain resource G.',
        'They\'ll happily take G if there is no cost C to lose, which only happens if they face no opposition or encounter another Dove.'
      ]
    },
    {
      heading: 'Dove: Pure Strategy',
      lines: [
        'Posture until the other withdraws.',
        'Withdraw if the other escalates or seems too strong'
      ]
    }
  ],
  Hawk: [
    {
      heading: 'The Hawk',
      lines: ['Hawks are aggressive']
    },
    {
      heading: 'Hawk Fight',
      lines: [
        'Hawks don\'t mind fighting for resources to gain G, even though they may lose and forfeit cost C, where G < C.',
        'Note: the higher the cost C, the more dangerous the animal is.'
      ]
    },
    {
      heading: 'Hawk: Pure Strategy',
      lines: [
        'Always escalate the conflict until either the other withdraws',
        'If the opposition does not withdraw, you are badly hurt.'
      ]
    }
  ],
  DoveHawk: [
    {
      heading: 'Dove vs Hawk',
      lines: ['Hawk takes all.']
    }
  ]
}

const STAGES = [
  { type: 'intro', copyKey: 'Dove', names: ['dove'], stage: 0 },
  { type: 'intro', copyKey: 'Dove', names: ['dove'], stage: 1 },
  { type: 'intro', copyKey: 'Dove', names: ['dove', 'dove'], stage: 2 },
  { type: 'intro', copyKey: 'Hawk', names: ['hawk'], stage: 3 },
  { type: 'intro', copyKey: 'Hawk', names: ['hawk'], stage: 4 },
  { type: 'intro', copyKey: 'Hawk', names: ['hawk', 'hawk'], stage: 5 },
  { type: 'intro', copyKey: 'DoveHawk', names: ['dove', 'hawk'], stage: 6 },
  { type: 'system', stage: 7 }
]

class App extends Component {
  constructor(props) {
    super(props)
    this.system = React.createRef()

    this._onResetTapped = this._onResetTapped.bind(this)
  }
  state = {
    activeStage: STAGES[7],
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
      prevStage: stage
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
      prevStage: stage
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
                      ref={this.system} />
                  )}
                </ContainerDimensions>
              </SystemViz>
              <SystemSidebar>
                <Results data={systemResults} />
                <NavWrapper>
                  <button onClick={this._onResetTapped}>Reset</button>
                </NavWrapper>
              </SystemSidebar>

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
