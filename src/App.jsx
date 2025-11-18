import {Link} from 'react-router-dom'
import React from "react";
import JerseySelector from './pages/JerseySelector.jsx'
import "./App.css";

export default function App(){
  return(
    <div style = {{padding: '2rem'}}>
      <h1>Aarnav Goon Cave</h1>
      <p>Software Developer • Python • C++ • JavaScript • React</p>

      <h2>Projects</h2>
      {/*
      <ul>
        <li>
          <Link to = "/jerseyselector">Jersey Selector (React)</Link>
        </li>
      </ul>
      */}
    </div>
  )
}