import { css } from 'styled-components'

export const media = {
  fromSmall: (...args) => css`
    @media (min-width: 600px) {
      ${css(...args)};
    }
  `,
  fromMedium: (...args) => css`
    @media (min-width: 800px) {
      ${css(...args)};
    }
  `,
  fromLarge: (...args) => css`
    @media (min-width: 1000px) {
      ${css(...args)};
    }
  `,
  fromXLarge: (...args) => css`
    @media (min-width: 1400px) {
      ${css(...args)};
    }
  `,
  fromXXLarge: (...args) => css`
    @media (min-width: 1800px) {
      ${css(...args)};
    }
  `
}
