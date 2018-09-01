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
  ]
}

const STAGES = [
  { type: 'intro', actor: 'Dove', stage: 0 },
  { type: 'intro', actor: 'Dove', stage: 1 },
  { type: 'intro', actor: 'Dove', stage: 2 },
  { type: 'intro', actor: 'Hawk', stage: 3 },
  { type: 'intro', actor: 'Hawk', stage: 4 },
  { type: 'intro', actor: 'Hawk', stage: 5 },
  { type: 'system', stage: 6 }
]

class App extends Component {
  state = {
    activeStage: STAGES[6],
    prevStage: -1,
    showSystem: true,
    stage: 0,
    systemResults: []
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
  _handleButtonClick = () => {
    const { stage } = this.state
    const nextStage = stage === STAGES.length - 1 ? 0 : stage + 1
    this.setState({
      stage: nextStage,
      prevStage: stage
    })
  }
  _handleSystemButtonClick = () => {
    this.setState({
      showSystem: !this.state.showSystem
    })
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
      showSystem,
      stage,
      systemResults
    } = this.state
    const copy = COPY[activeStage.actor]
    return (
      <AppWrapper>
        {activeStage.type === 'system'
          ? (
            <SystemWrapper>
              <ContainerDimensions>
                {({ height, width }) => (
                  <NaturalSystem
                    height={height * 0.8}
                    width={width * 0.8}
                    resultsCallback={this._handleSystemResultsChange} />
                )}
              </ContainerDimensions>
            </SystemWrapper>
          )
          : <ContainerDimensions>
            {({ height, width }) => (
              <ActorIntro
                height={height}
                name={activeStage.actor}
                copy={copy}
                prevStage={prevStage % 3}
                stage={stage % 3}
                width={width} />
            )}
          </ContainerDimensions>
        }
        {activeStage.type === 'system' && (
          <Results data={systemResults} />
        )}
        <NavWrapper>
          <button onClick={this._handleButtonClick}>Next</button>
          <button onClick={this._handleSystemButtonClick}>{showSystem ? 'Hide' : 'Show'} System</button>
        </NavWrapper>
      </AppWrapper>
    )
  }
}

export default App
