import './styles/App.css';
import { Routes, Route } from 'react-router-dom';
import AddText from './pages/AddText';
import About from './pages/About';
import MainPage from './pages/MainPage/MainPage';
import TextPage from './pages/TextPage/TextPage';
import LoginRegisterPage from './pages/LoginAndRegisterPage/LoginPage';
import Profile from './pages/UserPage/Profile';
import NavMenu from './pages/Navbar/NavMenu';
import { useUser } from './hooks/useUser';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTexts } from './hooks/useTexts';
import { IText } from './components/DataTypes';
import { useState } from 'react';

const App = () => {
   const { user, error, isUserLoading, loginUser, logoutUser } = useUser();
   const { texts, isTextsLoading } = useTexts();
   const [filteredTexts, setFilteredTexts] = useState<IText[]>([]);
   const [searchValue, setSearchValue] = useState<string>('');

   const darkTheme = createTheme({
      palette: {
         mode: 'dark',
      },
   });

   const handleSearchValueSet = (input: string) => {
      const val = input.toLowerCase();
      setFilteredTexts(texts.filter((text: IText) => text.title.toLowerCase().includes(val)));
      setSearchValue(input);
   };

   return (
      <>
         <ThemeProvider theme={darkTheme}>
            <NavMenu user={user} logoutUser={logoutUser} searchValue={searchValue} handleSearchValueSet={handleSearchValueSet} />
            <Routes>
               <Route path='/' element={<MainPage user={user} texts={texts} filteredTexts={filteredTexts} isTextsLoading={isTextsLoading} />} />
               <Route path='About' element={<About />} />
               <Route path='Login' element={<LoginRegisterPage loginUser={loginUser} isUserLoading={isUserLoading} />} />
               <Route path='AddText' element={<AddText user={user} />} />
               <Route path='Text/:textId' element={<TextPage user={user} />} />
               <Route path='/:userLogin' element={<Profile user={user} />} />
               <Route
                  path='*'
                  element={
                     <main style={{ padding: '1rem' }}>
                        <p>There's nothing here!</p>
                     </main>
                  }
               />
            </Routes>
         </ThemeProvider>
      </>
   );
};

export default App;
