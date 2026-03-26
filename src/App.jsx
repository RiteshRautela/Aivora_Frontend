import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
// import ProtectedRoute from "./components/ProtectedRoute";
import HomeHero from "./components/HomeHero";
import  NotFoundPage from "./components/NotFoundPage"
import appstore from "./utils/appstore";
import { Provider } from "react-redux";
import PageLoader from "./components/PageLoader";

// Lazy-load heavier pages so the first bundle stays smaller.
const LandingPage = lazy(() => import("./components/LandingPage"));
const Dashboard = lazy(() => import("./components/Dashboard"));
const Generate = lazy(() => import("./components/Generate"));
const Editor = lazy(() => import("./components/Editor"));
const LiveSite = lazy(() => import("./components/LiveSite"));
const Pricing = lazy(() => import("./components/Pricing"));

// Wrap each lazy page with the same loader.
function withPageLoader(Component) {
  return (
    <Suspense fallback={<PageLoader text="Cooking" />}>
      <Component />
    </Suspense>
  );
}

function App() {
  
  return (
    <Provider store={appstore}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={withPageLoader(LandingPage)} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/home"
            element={
              
                <Home />
              
            }
          >
            <Route index element={<HomeHero />} />
            <Route path="dashboard" element={withPageLoader(Dashboard)} />
            <Route path="generate" element={withPageLoader(Generate)} />
            <Route
              path="editor"
              element={<Navigate to="/home/dashboard" replace />}
            />
            <Route path="editor/:id" element={withPageLoader(Editor)} />
            <Route path="price" element={withPageLoader(Pricing)} /> 
          </Route>
          <Route path="/live/:slug" element={withPageLoader(LiveSite)} />
          
          <Route path="*" element={< NotFoundPage/>} />
        </Routes>

      </BrowserRouter>
      </Provider>
   
  );
}

export default App;
