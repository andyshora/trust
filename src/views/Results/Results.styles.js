import styled from 'styled-components'

// import { theme, media } from '../../styles/utils'

export const ResultsWrapper = styled.div`
  padding: 2rem;
  background: black;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1;
  text-align: left;
  border-top: 1px solid white;
  border-left: 1px solid white;

  > h3 {
    text-align: center;
  }
`
export const ResultsTable = styled.table`
  margin: 0 1rem 1rem
  th, td {
    padding: 0.5rem
  }
`
