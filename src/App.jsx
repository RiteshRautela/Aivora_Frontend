import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import LandingPage from "./components/LandingPage";
import Home from "./components/Home";
import Login from "./components/Login";
import appstore from "./utils/appstore";

function App() {
  return (
    <Provider store={appstore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;