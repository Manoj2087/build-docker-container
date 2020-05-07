import React from 'react'
import {Navbar, Nav, NavDropdown} from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { BsGrid3X3Gap } from "react-icons/bs"
import { Link } from 'react-router-dom'
import './App.css'
import AppRoutes from './AppRoutes'

export default function App() {
  return (
    <div className="app">
      <Container className="myNavBar">
        <Navbar fluid>
          <Navbar.Brand>
            <Link to="/">
              ROBO-Factory
            </Link>
          </Navbar.Brand>
          <Nav className="container-fluid">
          <NavDropdown 
            title= {
              <BsGrid3X3Gap />
            }
            id="basic-nav-dropdown"
            className="ml-auto"
          >          
            <NavDropdown.Item>
              <Link to="/">
                Home
              </Link>
            </NavDropdown.Item>
            <NavDropdown.Item>
              <Link to="/about">
                About
              </Link>
            </NavDropdown.Item>
          </NavDropdown>
          </Nav>
        </Navbar>
      </Container>
      <Container>
        <AppRoutes />
      </Container>
    </div>
  )
}
