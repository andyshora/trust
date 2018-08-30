import React, { Component } from 'react'
import ContainerDimensions from 'react-container-dimensions'
import keydown from 'react-keydown'

// Components
import ActorIntro from '../ActorIntro'

// Views
import NaturalSystem from '../../systems/NaturalSystem'

// Styles
import '../../styles/generic'
import {
  AppWrapper,
  NavWrapper,
  SystemWrapper
} from './App.styles'

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
    activeStage: STAGES[0],
    showSystem: false,
    stage: 0,
    prevStage: -1
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
  render() {
    const {
      activeStage,
      prevStage,
      showSystem,
      stage
    } = this.state
    return (
      <AppWrapper>
        {activeStage.type === 'system'
          ? (
            <SystemWrapper>
              <ContainerDimensions>
                {({ height, width }) => (
                  <NaturalSystem
                    height={height * 0.8}
                    width={width * 0.8} />
                )}
              </ContainerDimensions>
            </SystemWrapper>
          )
          : <ContainerDimensions>
            {({ height, width }) => (
              <ActorIntro
                height={height}
                name={activeStage.actor}
                prevStage={prevStage % 3}
                stage={stage % 3}
                width={width} />
            )}
          </ContainerDimensions>
        }
        <NavWrapper>
          <button onClick={this._handleButtonClick}>Next</button>
          <button onClick={this._handleSystemButtonClick}>{showSystem ? 'Hide' : 'Show'} System</button>
        </NavWrapper>
      </AppWrapper>
    )
  }
}

export default App
