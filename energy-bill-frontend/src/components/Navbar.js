import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Link)`
  font-size: 1.5em;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.lightText};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
`;

const NavLinks = styled.div`
  a {
    color: ${({ theme }) => theme.colors.lightText};
    text-decoration: none;
    margin-left: 30px;
    font-weight: bold;
    transition: color 0.3s;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Logo to="/">Lumi</Logo>
      <NavLinks>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/invoices">Invoices</Link>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
