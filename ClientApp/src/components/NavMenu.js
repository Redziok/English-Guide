import React, { useState } from 'react';
import logo from '../assets/backgroundfix.png';
import '../styles/NavMenu.css';
import axios from 'axios';
import { API_CALL } from './constants';
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
	DropdownItem,
} from 'reactstrap';

const NavMenu = (props) => {
	const [isOpen, setIsOpen] = useState(false);
	const { isUserLogged, user, loggedOut } = props;

	const toggle = () => setIsOpen(!isOpen);

	const logoutHandle = () => {
		axios.post(`${API_CALL}/User/logout`, null, { withCredentials: true }).then(() => {
			loggedOut();
		});
	};

	return (
		<Navbar className="my-2" color="dark" expand="sm" dark>
			<NavbarBrand href="/">
				<img className="logo" src={logo} alt="" />
			</NavbarBrand>
			<NavbarToggler onClick={toggle} />
			<Collapse isOpen={isOpen} navbar>
				<Nav className="ms-auto" navbar tabs>
					{isUserLogged ? (
						<UncontrolledDropdown direction="down" nav>
							{window.location.pathname === `/${user?.login}` ? (
								<DropdownToggle color="light">
									<i className="fa fa-user-circle" />
								</DropdownToggle>
							) : (
								<DropdownToggle nav>
									<i className="fa fa-user-circle" />
								</DropdownToggle>
							)}
							<DropdownMenu right>
								<DropdownItem disabled>Hi {user?.login}</DropdownItem>
								<DropdownItem divider />
								<DropdownItem href={`/${user?.login}`}>Profile</DropdownItem>
								<DropdownItem onClick={logoutHandle}>Logout</DropdownItem>
							</DropdownMenu>
						</UncontrolledDropdown>
					) : (
						<NavItem>
							<NavLink href="/login" active={window.location.pathname === '/login'}>
								Login
							</NavLink>
						</NavItem>
					)}
					<NavItem>
						<NavLink href="/about" active={window.location.pathname === '/about'}>
							About
						</NavLink>
					</NavItem>
				</Nav>
			</Collapse>
		</Navbar>
	);
};

export default NavMenu;
