import styled, { keyframes } from 'styled-components'

import { media } from '../../styles/utils'

const transitionOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`

export const ActorIntroWrapper = styled.div`
`

export const ActorSectionsWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  position: relative;
`

const ActorIntroSection = styled.section`
  position: fixed;
  width: 100%;
  height: 100%;
  padding: 1rem;
  display: grid;
  text-align: center;

  > hgroup {
    padding: 1rem 2rem;
    min-height: 200px;
  }

  > div {
    margin: 2rem auto;
  }
  ${media.fromLarge``}
`

export const ActorSpin = ActorIntroSection.extend`
  display: ${props => props.active || props.transitionOut ? 'block' : 'none'};
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};
`
export const ActorDescription = ActorIntroSection.extend`
  display: ${props => props.active || props.transitionOut ? 'block' : 'none'};
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};
`
export const ActorMeets = ActorIntroSection.extend`
  display: ${props => props.active || props.transitionOut ? 'block' : 'none'};
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};
`

export const ActorWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`
