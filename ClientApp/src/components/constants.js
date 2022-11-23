export const customStyles = {
    singleValue:(provided, { data }) => ({
        ...provided,
        height:'100%',
        color:'white',
        paddingTop:'3px'
      }),
    placeholder: base => ({
        color:'white',
        margin: '-25px 0 0 0',
        paddingBottom:'5px'
    }),
    control: (base, state) => ({
      ...base,
      background: "rgb(24, 26, 27)",
      // match with the menu
      borderRadius: state.isFocused ? "3px 3px 0 0" : 3,
      // Overwrittes the different states of border
      borderColor: state.isFocused ? "yellow" : "green",
      // Removes weird border around container
      boxShadow: state.isFocused ? null : null,
      "&:hover": {
        // Overwrittes the different states of border
        borderColor: state.isFocused ? "red" : "blue"
      }
    }),
    menu: base => ({
      ...base,
      // override border radius to match the box
      borderRadius: 0,
      // kill the gap
      marginTop: 0,
    }),
    menuList: (base, state) => ({
        background: "rgb(24, 26, 27)",
      ...base,
      // kill the white space on first and last option
      padding: 0
    }),
    option: (base, {data, isFocused}) => ({
      ...base,
      background: isFocused && "grey"
    })
  };

export const API_CALL = 'https://localhost:5001/api'; //7232
export const LOCAL_API = "https://inzynierka-mingielewicz-backen.herokuapp.com/api";
export const holder = 'https://inzynierka-mingielewicz-backend.onrender.com/api';
