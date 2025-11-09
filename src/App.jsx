import {Link} from 'react-router-dom'

function App(){
  return(
    <div style = {{padding: '2rem'}}>
      <h1>Abhiram Agina</h1>
      <p>Software Developer • Python • C++ • JavaScript • React</p>

      <h2>Projects</h2>
      <ul>
        <li>
          <Link to = "/jerseyselector">Randomized Jersey Selector (React)</Link>
        </li>
      </ul>
    </div>
  )
}

export default App