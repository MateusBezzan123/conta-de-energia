import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NavbarContainer = styled.nav`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavLinks = styled.div`
  a {
    color: ${({ theme }) => theme.colors.lightText};
    text-decoration: none;
    margin-left: 20px;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Navbar = () => {
  return (
    <NavbarContainer>
      <Link to="/dashboard">Dashboard</Link>
      <NavLinks>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/invoices">Invoices</Link>
      </NavLinks>
    </NavbarContainer>
  );
};

export default Navbar;
