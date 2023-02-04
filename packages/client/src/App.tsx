// import { useEffect } from "react";
import "./App.css";
// import Login from './pages/authentication/Login'
import Register from './pages/authentication/Register'

function App() {
  // useEffect(() => {
  //   const fetchServerData = async () => {
  //     const url = `http://localhost:${__SERVER_PORT__}`;
  //     const response = await fetch(url);
  //     const data = await response.json();
  //     console.log(data);
  //   };
  //
  //   fetchServerData();
  // }, []);
  return <div className="App">
    {/* <Login/> */}
    <Register />
  </div>;
}

export default App;
