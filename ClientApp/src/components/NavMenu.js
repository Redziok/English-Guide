import React, { useState, useEffect } from 'react';
import logo from "../assets/backgroundfix.png";
import '../styles/NavMenu.css';
import axios from "axios";
import { API_CALL } from "../components/constants";


import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

function NavMenu(args) {
    const [isOpen, setIsOpen] = useState(false);
    const [username, setUsername] = useState('')

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${API_CALL}/User/user`, {
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                });

                const content = await response.json();
                setUsername(content.login);
            }
        )();
    },[username]);

    const logoutHandle = () => {
        axios.post(`${API_CALL}/User/logout`, null, {withCredentials: true})
            .then(res => {
                setUsername('')
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <Navbar className='my-2' color='dark' expand="sm" dark>
            <NavbarBrand href="/"><img className="logo" src={logo} alt="" /></NavbarBrand>
            <NavbarToggler onClick={toggle} />
            <Collapse isOpen={isOpen} navbar>
                <Nav className="ms-auto" navbar tabs>
                    {username !== undefined && <UncontrolledDropdown nav inNavbar>
                        {window.location.pathname === '/profile' ? 
                        <DropdownToggle color='light'>
                            <i className="fa fa-user-circle"></i>
                        </DropdownToggle> :
                        <DropdownToggle nav>
                            <i className="fa fa-user-circle"></i>
                        </DropdownToggle>}
                        <DropdownMenu right>
                            <DropdownItem disabled>Hi {username}</DropdownItem>
                            <DropdownItem divider />
                            <DropdownItem href="/profile">Profile</DropdownItem>
                            <DropdownItem onClick={logoutHandle}>Logout</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>}
                    <NavItem>
                        <NavLink href="/login" active={window.location.pathname === '/login'}> Login</NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink href="/about" active={window.location.pathname === '/about'}> About </NavLink>
                    </NavItem>
                </Nav>
            </Collapse>
        </Navbar>
    );
}

export default NavMenu;