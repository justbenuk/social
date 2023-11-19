import './App.css';
import Landing from './components/layout/Landing';
import Navbar from './components/layout/Navbar';
import Login from './components/auth/Login';
import Register from './components/auth/register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
//redux stuff
import { Provider } from 'react-redux';
import store from './store';
function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path='/' element=<Landing /> />
          <Route exact path='/register' element=<Register /> />
          <Route exact path='/login' element=<Login /> />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
