import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
body {
  font-family: ${({ theme }) => theme.fonts.main};
  background-color: ${({ theme }) => theme.colors.background};
  margin: 0;
  padding: 0;
}

h1, h2 {
  font-family: ${({ theme }) => theme.fonts.heading};
  color: ${({ theme }) => theme.colors.primary};
}

button {
  transition: background-color 0.3s ease;
}

input, button {
  font-family: ${({ theme }) => theme.fonts.main};
}
`;
