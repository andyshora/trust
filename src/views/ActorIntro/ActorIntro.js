import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Dove from '../../actors/Dove'

// Styles
import {
  ActorIntroWrapper,
  ActorSpin,
  ActorDescription,
  ActorMeets,
  ActorSectionsWrapper,
  ActorWrapper
} from './ActorIntro.styles'

const _getBehaviour = stage => {
  let behaviour = ''
  switch (stage) {
    case 1:
      behaviour = 'flying'
      break
    case 2:
      behaviour = 'meeting'
      break
    default:
      behaviour = 'spinning'
      break
  }
  return behaviour
}

const _getActorDims = ({ height, stage, width }) => {
  switch (stage) {
    case 0:
      return { width: width * 0.5, height: width * 0.5 * 0.6 }
    case 1:
      return { width: width * 0.5, height: width * 0.5 * 0.6 }
    case 2:
      return { width: width * 0.8, height: width * 0.8 * 0.3 }
    default:
      return
  }
}

class ActorIntro extends Component {
  _actor = React.createRef()
  render() {
    const {
      height,
      name,
      prevStage,
      stage,
      width
    } = this.props

    const actorDimensions = _getActorDims({
      height,
      stage,
      width
    })

    const actorComponent = (
      <ActorWrapper {...actorDimensions}>
        <Dove
          ref={this._actor}
          behaviour={_getBehaviour(stage)}
          cameraZ={stage === 2 ? 1500 : 500}
          {...actorDimensions} />
      </ActorWrapper>
    )

    return (
      <ActorIntroWrapper>
        <ActorSectionsWrapper height={height} width={width}>
          <ActorSpin active={!stage} transitionOut={!prevStage}>
            <hgroup>
              <h1>{name} 1</h1>
            </hgroup>
            <aside>Lorem ipsum sudor sit amet.</aside>
            {!stage && actorComponent}
          </ActorSpin>
          <ActorDescription active={stage === 1} transitionOut={prevStage === 1}>
            <hgroup>
              <h1>{name} 2</h1>
            </hgroup>
            <aside>Lorem ipsum sudor sit amet.</aside>
            {stage === 1 && actorComponent}
          </ActorDescription>
          <ActorMeets active={stage === 2} transitionOut={prevStage === 2}>
            <hgroup>
              <h1>{name} 3</h1>
            </hgroup>
            <aside>Lorem ipsum sudor sit amet.</aside>
            {stage === 2 && actorComponent}
          </ActorMeets>
        </ActorSectionsWrapper>
      </ActorIntroWrapper>
    )
  }
}

ActorIntro.propTypes = {
  height: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  prevStage: PropTypes.number,
  stage: PropTypes.number,
  width: PropTypes.number.isRequired
}

ActorIntro.defaultProps = {
  prevStage: null,
  stage: null
}

export default ActorIntro
