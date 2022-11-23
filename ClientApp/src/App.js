import React, { Component } from 'react';
import './styles/App.css';
import { Routes, Route } from "react-router-dom";
import AddText from "./pages/AddText";
import About from "./pages/About";
import SearchText from './pages/SearchText';
import TextPage from './pages/TextPage';
import LoginForm from './pages/LoginForm';

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (   
      <Routes>
          <Route path="About" element={<About />} />
          <Route path="Login" element={<LoginForm />} />
          <Route path="/" element={<SearchText />}/>
          <Route path="Text/:textId" element={<TextPage />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
        <Route path="AddText" element={<AddText />} />
      </Routes>
    );
  }
}
