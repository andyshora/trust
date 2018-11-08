import styled from 'styled-components'
import chroma from 'chroma-js'

const healthScale = chroma.scale(['black', 'red', 'yellow', 'lime'])
// import { theme, media } from '../../styles/utils'

export const AppWrapper = styled.div`
  display: flex;
  justify-content: center;
`

export const NavWrapper = styled.div`
  padding: 1rem;
`

export const ResultsTable = styled.table`
`

export const HealthSwatch = styled.span`
  display: inline-block;
  width: ${props => props.health * 20}px;
  height: 2px;
  background: ${props => healthScale(props.health).hex()};
  margin: 0 1rem;
`

export const ReceivedCell = styled.td`
  > span {
    display: inline-block;
    border: 1px solid red;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    text-align: center;
    font-size: 1rem;
    line-height: 1.5rem;
    opacity: ${props => props.opacity};
  }
`

export const SentCell = styled.td`
> span {
  display: inline-block;
  border: 1px solid white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  text-align: center;
  font-size: 1rem;
  line-height: 1.5rem;
  opacity: ${props => props.opacity};
}
`

export const ResultsTableRow = styled.tr`
  opacity: ${props => props.active ? 1 : 0.3};

  > td {
    padding-right: 5px;
    white-space: nowrap;

    &:first-child {
      width: 50px;
    }
  }
`

export const SystemWrapper = styled.div`
  position: fixed;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  height: 700px;
  z-index: 1;
  background: black;
  display: grid;
  grid-template-columns: 1fr 300px;
`
export const ResultsWrap = styled.ul`
  padding: 50px 1rem 1rem;
  margin: 0;
  width: 300px;

  > li {
    list-display-type: none;
    padding: 1rem;
    border-bottom: 1px dashed hotpink;

    span {
      display: inline-block;
      margin-right: 2rem;
    }
  }
`
export const SystemViz = styled.div`

`
