import styled from 'styled-components'

// import { theme, media } from '../../styles/utils'

export const ResultsWrapper = styled.div`
  padding: 2rem;
  background: hotpink;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1;
  text-align: left;

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
