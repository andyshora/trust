import styled from 'styled-components'

// import { theme, media } from '../../styles/utils'

export const AppWrapper = styled.div`
`

export const NavWrapper = styled.div`
  padding: 1rem;
`
export const SystemWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
  background: black;
  display: grid;
  grid-template-columns: 1fr;
`
export const ResultsWrap = styled.ul`
  padding: 1rem;
  margin: 0;
  width: 400px;

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
