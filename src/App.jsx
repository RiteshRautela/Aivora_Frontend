import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import Generate from "./components/Generate";
// import ProtectedRoute from "./components/ProtectedRoute";
import HomeHero from "./components/HomeHero";
import  NotFoundPage from "./components/NotFoundPage"
import Editor from "./components/Editor"
import appstore from "./utils/appstore";
import { Provider } from "react-redux";





function App() {
  
  return (
    <Provider store={appstore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/home"
            element={
              
                <Home />
              
            }
          >
            <Route index element={<HomeHero />} />
            <Route path="dashboard" element={<Dashboard/> } />
            <Route path="generate" element={<Generate />} />
            <Route path="editor" element={<Editor />} />
          </Route>
          <Route path="*" element={< NotFoundPage/>} />
        </Routes>

      </BrowserRouter>
      </Provider>
   
  );
}

export default App;
