import styledNormalize from 'styled-normalize'
import { theme } from '../styles/theme'

export const baseStyles = `
${styledNormalize}

* {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
}

html {
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  font-size: 62.5%;
  font-family: Lato, sans-serif;
}
body {
  color: $color-d1;
  font-family: Lato, sans-serif;
  min-width: 375px;
  line-height: 1;
  font-size: 1.4rem;
  font-weight: 300;
  color: ${theme.colors.d1};
  overflow-x: hidden;
}
h1, h2, h3, h4, h5 {
  font-family: Poppins, sans-serif;
  font-weight: 300;
}

p {
  line-height: 1.4;
  font-size: 1.6rem;
  margin: 1rem 0;
}
a {
  color: ${theme.colors.p1};
}
h1 {
  font-size: 4.6rem;
  line-height: 5.4rem;
  margin: 1.6rem 0 1rem;
}
h2 {
  font-size: 2.4rem;
  line-height: 3rem;
  margin: 1rem 0;
  font-weight: 400;
}
h3, h4, h5 {
  font-size: 1.8rem;
  line-height: 2.4rem;
  text-transform: uppercase;
  margin: 1.6rem 0 1rem;
  font-weight: 400;
  letter-spacing: 1px;
}
`
