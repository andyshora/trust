import React, { Component } from 'react'
import PropTypes from 'prop-types'
import loop from 'raf-loop'

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
      return { width: width * 0.3, height: width * 0.3 * 0.6 }
    case 2:
      return { width: width * 0.8, height: width * 0.6 }
  }
}

class ActorIntro extends Component {
  constructor(props) {
    super(props)
    this._actor = React.createRef()

    this._animationEngine = null
  }
  componentDidUpdate() {
    if (!this._actor.current) {
      console.warn('No actor to animate. Stopping.')
      this._animationEngine.stop()
    }
  }
  componentDidMount() {
    this._animationEngine = loop(this._animationLoop.bind(this))
    if (this._actor.current) {
      this._animationEngine.start()
    }
  }
  _animationLoop = () => {
    if (this._actor.current && typeof this._actor.current._render === 'function') {
      this._actor.current._render()
    } else {
      console.warn('No actor to animate. Stopping.')
      this._animationEngine.stop()
    }
  }
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
          {...actorDimensions} />
      </ActorWrapper>
    )

    return (
      <ActorIntroWrapper>
        <ActorSectionsWrapper height={height} width={width}>
          <ActorSpin active={!stage} transitionOut={!prevStage}>
            <h1>Dove</h1>
            {actorComponent}
          </ActorSpin>
          <ActorDescription active={stage === 1} transitionOut={prevStage === 1}>
            <h1>Doves stick together</h1>
            {actorComponent}
          </ActorDescription>
          <ActorMeets active={stage === 2} transitionOut={prevStage === 2}>
            <h1>Doves Cooperate</h1>
            {actorComponent}
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
