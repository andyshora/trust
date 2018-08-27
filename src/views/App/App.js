import React, { Component } from 'react'
import ContainerDimensions from 'react-container-dimensions';
import keydown, { ALL_KEYS } from 'react-keydown'


// Components
import ActorIntro from '../ActorIntro'

// Styles
import '../../styles/generic'
import {
  AppWrapper,
  NavWrapper
} from './App.styles'

const NUM_INTRO_STAGES = 3;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 0,
      prevStage: -1
    }
  }
  @keydown('right')
  nextStage() {
    const { stage } = this.state
    if (stage === NUM_INTRO_STAGES - 1) {
      return;
    }
    this.setState({
      stage: stage + 1,
      prevStage: stage
    });
  }
  @keydown('left')
  prevStage() {
    const { stage } = this.state
    if (!stage) {
      return;
    }
    this.setState({
      stage: stage - 1,
      prevStage: stage
    });
  }
  _handleButtonClick = () => {
    const { stage } = this.state
    const nextStage = stage === NUM_INTRO_STAGES - 1 ? 0 : stage + 1
    this.setState({
      stage: nextStage,
      prevStage: stage
    });
  }
  render() {
    const {
      prevStage,
      stage
    } = this.state
    return (
      <AppWrapper>
        <ContainerDimensions>
          {({ height, width }) => (
            <ActorIntro
              height={height}
              name='Dove'
              prevStage={prevStage}
              stage={stage}
              width={width} />
          )}
        </ContainerDimensions>
        <NavWrapper>
          <button onClick={this._handleButtonClick}>Next</button>
        </NavWrapper>
      </AppWrapper>
    )
  }
}

export default App
