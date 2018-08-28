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

  > hgroup {
    grid-area: heading;
    padding: 1rem 2rem;
    border: 1px solid lightBlue;
  }

  > div {
    grid-area: scene;
  }

  > aside {
    grid-area: description;
    border: 1px solid white;
  }
  ${media.fromLarge``}
`

export const ActorSpin = ActorIntroSection.extend`
  display: ${props => props.active || props.transitionOut ? 'grid' : 'none'};
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};
  text-align: center;

  grid-template-columns: 100%;
  grid-template-areas:
            "heading"
            "description"
            "scene";

  > div {
    margin: 0 auto;
  }
`
export const ActorDescription = ActorIntroSection.extend`
  display: ${props => props.active || props.transitionOut ? 'grid' : 'none'};
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};
  grid-template-columns: 50% 50%;
  grid-template-areas:
            "heading heading"
            "scene description";
`
export const ActorMeets = ActorIntroSection.extend`
  display: ${props => props.active || props.transitionOut ? 'grid' : 'none'};
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};

  grid-template-areas:
            "heading"
            "description"
            "scene";

  > div {
    margin: 0 auto;
  }
`

export const ActorWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`
