import { useState } from 'react';
import logo from '../../assets/backgroundfix.png';
import '../../styles/NavMenu.css';
import { IUser } from '../../components/DataTypes';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { Divider } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/constants';

interface INavMenuProps {
   user: IUser | null;
   logoutUser: () => Promise<void>;
   searchValue: string;
   handleSearchValueSet: (input: string) => void;
}

const NavMenu = ({ user, logoutUser, searchValue, handleSearchValueSet }: INavMenuProps) => {
   const navigate = useNavigate();
   const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

   const handleCloseUserMenu = () => {
      setAnchorElUser(null);
   };

   return (
      <AppBar position='static'>
         <Container maxWidth={false}>
            <Toolbar disableGutters>
               <Typography
                  variant='h6'
                  noWrap
                  component='a'
                  href='/'
                  sx={{
                     mr: 2,
                     display: { xs: 'none', md: 'flex' },
                     fontFamily: 'monospace',
                     fontWeight: 700,
                     letterSpacing: '.3rem',
                     color: 'inherit',
                     textDecoration: 'none',
                  }}>
                  <img className='logo' src={logo} alt='' />
               </Typography>
               <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                  <Button sx={{ my: 2, color: 'white', display: 'block' }} onClick={() => navigate('/About')}>
                     About
                  </Button>
               </Box>
               {window.location.pathname === '/' && (
                  <Box sx={{ marginRight: '1rem' }}>
                     <Search>
                        <SearchIconWrapper>
                           <FontAwesomeIcon icon={faSearch} />
                        </SearchIconWrapper>
                        <StyledInputBase placeholder='Search…' inputProps={{ 'aria-label': 'search' }} value={searchValue} onChange={e => handleSearchValueSet(e.currentTarget.value)} />
                     </Search>
                  </Box>
               )}

               {user != null ? (
                  <Box sx={{ flexGrow: 0 }}>
                     <Tooltip title='Open settings'>
                        <IconButton onClick={e => setAnchorElUser(e.currentTarget)} sx={{ p: 0 }}>
                           <Avatar alt={user.login} src='/static/images/avatar/2.jpg' />
                        </IconButton>
                     </Tooltip>
                     <Menu
                        sx={{ mt: '45px' }}
                        id='menu-appbar'
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                           vertical: 'top',
                           horizontal: 'right',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}>
                        <MenuItem onClick={handleCloseUserMenu} disabled>
                           <Typography textAlign='center' onClick={() => navigate(`/${user.login}`)}>
                              {`Hi ${user.login}`}
                           </Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleCloseUserMenu}>
                           <Typography textAlign='center' onClick={() => navigate(`/${user.login}`)}>
                              Profile
                           </Typography>
                        </MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}>
                           <Typography textAlign='center' onClick={logoutUser}>
                              Logout
                           </Typography>
                        </MenuItem>
                     </Menu>
                  </Box>
               ) : (
                  <Button color='inherit' onClick={() => navigate('/Login')}>
                     Login
                  </Button>
               )}
            </Toolbar>
         </Container>
      </AppBar>
   );
};

export default NavMenu;
