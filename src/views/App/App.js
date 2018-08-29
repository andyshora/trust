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

const NUM_INTRO_STAGES = 3

class App extends Component {
  state = {
    showSystem: false,
    stage: 0,
    prevStage: -1
  }
  @keydown('right')
  nextStage() {
    const { stage } = this.state
    if (stage === NUM_INTRO_STAGES - 1) {
      return
    }
    this.setState({
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
      stage: stage - 1,
      prevStage: stage
    })
  }
  _handleButtonClick = () => {
    const { stage } = this.state
    const nextStage = stage === NUM_INTRO_STAGES - 1 ? 0 : stage + 1
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
      prevStage,
      showSystem,
      stage
    } = this.state
    return (
      <AppWrapper>
        {showSystem
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
                name='Dove'
                prevStage={prevStage}
                stage={stage}
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
