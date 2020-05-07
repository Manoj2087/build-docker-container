import React from 'react'
import {Navbar, Nav, NavDropdown} from 'react-bootstrap'
import Container from 'react-bootstrap/Container'
import { BsGrid3X3Gap } from "react-icons/bs";
import './App.css'
import Home from './containers/Home'

export default function App() {
  return (
    <div className="app">
      <Container className="myNavBar">
        <Navbar fluid>
          <Navbar.Brand href="#home">ROBO-Factory</Navbar.Brand>
          <Nav>
          <NavDropdown 
            title= {
              <BsGrid3X3Gap />
            }
            id="basic-nav-dropdown"            
          >          
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
          </Nav>
        </Navbar>
      </Container>
      <Container>
        <Home />
      </Container>
    </div>
  )
}
