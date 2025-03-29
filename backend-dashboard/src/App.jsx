import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/larkon" 
          element={
            <iframe
              src="/larkon/index.html"
              style={{
                width: '100%',
                height: '100vh',
                border: 'none'
              }}
              title="Larkon Page"
            />
          }
        />
        <Route 
          path="/"
          element={
            <div className="App">
              <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="https://reactjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Learn React
                </a>
              </header>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
