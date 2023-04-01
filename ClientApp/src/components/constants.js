import Swal from 'sweetalert2';
import { InputBase, alpha, styled } from '@mui/material';

//export const API_CALL = 'api';
export const API_CALL = `${process.env.REACT_APP_API_URL}`;
//export const API_CALL = 'https://localhost:7232/api';
//export const API_CALL = 'https://mingielewicz-inzynierka.onrender.com/api';

export const languages = [
   { value: 'Polish', label: 'Polish' },
   { value: 'English', label: 'English' },
   { value: 'German', label: 'German' },
   { value: 'Russian', label: 'Russian' },
   { value: 'Spanish', label: 'Spanish' },
];

export const createToast = Swal.mixin({
   toast: true,
   animation: true,
   icon: 'success',
   position: 'top-right',
   timer: 2000,
   background: '#333',
   color: 'white',
   timerProgressBar: true,
   showConfirmButton: false,
   didOpen: toast => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
   },
});

export const customStyles = {
   singleValue: (provided, { data }) => ({
      ...provided,
      height: '100%',
      color: 'white',
      paddingTop: '3px',
   }),
   placeholder: base => ({
      color: 'white',
      margin: '-25px 0 0 0',
      paddingBottom: '5px',
   }),
   control: (base, state) => ({
      ...base,
      background: 'rgb(24, 26, 27)',
      // match with the menu
      borderRadius: state.isFocused ? '3px 3px 0 0' : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused ? 'yellow' : 'green',
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      '&:hover': {
         // Overwrittes the different states of border
         borderColor: state.isFocused ? 'red' : 'blue',
      },
   }),
   menu: base => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
   }),
   menuList: (base, state) => ({
      background: 'rgb(24, 26, 27)',
      ...base,
      // kill the white space on first and last option
      padding: 0,
   }),
   option: (base, { data, isFocused }) => ({
      ...base,
      background: isFocused && 'grey',
   }),
};

export const Search = styled('div')(({ theme }) => ({
   position: 'relative',
   borderRadius: theme.shape.borderRadius,
   backgroundColor: alpha(theme.palette.common.white, 0.15),
   '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
   },
   marginLeft: 0,
   width: '100%',
   [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
   },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
   padding: theme.spacing(0, 2),
   height: '100%',
   position: 'absolute',
   pointerEvents: 'none',
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
   color: 'inherit',
   '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
         width: '12ch',
         '&:focus': {
            width: '20ch',
         },
      },
   },
}));
