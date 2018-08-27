import styled, { keyframes } from 'styled-components'

// import { theme, media } from '../../styles/utils'
//
const transitionOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const ActorIntroWrapper = styled.div`
`

export const ActorSectionsWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  position: relative;
`

const ActorIntroSection = styled.section`
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 1rem;
  border: 1px solid lightBlue;
`;
export const ActorSpin = ActorIntroSection.extend`
  background: red;
  display: ${props => props.active || props.transitionOut ? 'grid' : 'none'};
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};

  > div {
    margin: 0 auto;
  }
`
export const ActorDescription = ActorIntroSection.extend`
  background: orange;
  display: ${props => props.active || props.transitionOut ? 'grid' : 'none'};
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};
`
export const ActorMeets = ActorIntroSection.extend`
  background: green;
  display: ${props => props.active || props.transitionOut ? 'grid' : 'none'};
  grid-template-columns: repeat(2, 50%);
  animation: ${props => props.transitionOut ? `${transitionOut} 1s forwards`: 'none'};

  > div {
    &:nth-child(2) {
      margin-left: auto;
    }
  }
`

export const ActorWrapper = styled.div`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  background: red;
`
