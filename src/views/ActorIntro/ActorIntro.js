import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Actor from '../../actors/Actor'

// Styles
import {
  ActorIntroWrapper,
  ActorSpin,
  ActorDescription,
  ActorMeets,
  ActorSectionsWrapper,
  ActorWrapper
} from './ActorIntro.styles'

const _getBehaviour = (stage, names) => {
  if (names.length > 1) {
    return 'meeting'
  }
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
      return { width: width * 0.8, height: width * 0.8 * 0.6 }
    case 1:
      return { width: width * 0.8, height: width * 0.8 * 0.6 }
    case 2:
      return { width: width * 0.8, height: width * 0.8 * 0.6 }
    default:
      return
  }
}

class ActorIntro extends Component {
  _actor = React.createRef()
  render() {
    const {
      copy,
      height,
      names,
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
        <Actor
          ref={this._actor}
          names={names}
          behaviour={_getBehaviour(stage, names)}
          cameraZ={stage === 2 || names.length > 1 ? 1500 : 500}
          {...actorDimensions} />
      </ActorWrapper>
    )

    return (
      <ActorIntroWrapper>
        <ActorSectionsWrapper height={height} width={width}>
          <ActorSpin active={!stage} transitionOut={!prevStage}>
            <hgroup>
              <h1>{copy[stage].heading}</h1>
              {copy[stage].lines.map((l, i) => <h4 key={i}>{l}</h4>)}
            </hgroup>
            {!stage && actorComponent}
          </ActorSpin>
          <ActorDescription active={stage === 1} transitionOut={prevStage === 1}>
            <hgroup>
              <h1>{copy[stage].heading}</h1>
              {copy[stage].lines.map((l, i) => <h4 key={i}>{l}</h4>)}
            </hgroup>
            {stage === 1 && actorComponent}
          </ActorDescription>
          <ActorMeets active={stage === 2} transitionOut={prevStage === 2}>
            <hgroup>
              <h1>{copy[stage].heading}</h1>
              {copy[stage].lines.map((l, i) => <h4 key={i}>{l}</h4>)}
            </hgroup>
            {stage === 2 && actorComponent}
          </ActorMeets>
        </ActorSectionsWrapper>
      </ActorIntroWrapper>
    )
  }
}

ActorIntro.propTypes = {
  copy: PropTypes.arrayOf(PropTypes.object).isRequired,
  height: PropTypes.number.isRequired,
  names: PropTypes.arrayOf(PropTypes.string).isRequired,
  prevStage: PropTypes.number,
  stage: PropTypes.number,
  width: PropTypes.number.isRequired
}

ActorIntro.defaultProps = {
  prevStage: null,
  stage: null
}

export default ActorIntro
