import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppHeader from "../appHeader/AppHeader";
import Spinner from "../spinner/Spinner";

const Error404 = lazy(() => import("../pages/404"));
const MainPage = lazy(() => import("../pages/MainPage"));
const ComicsPage = lazy(() => import("../pages/ComicsPage"));
const SingleComicPage = lazy(() => import("../pages/SingleComicPage"));
const SingleCharactorPage = lazy(() => import("../pages/SingleCharactorPage"));

const App = () => {
  return (
    <Router>
      <div className="app">
        <AppHeader />
        <main>
          <Suspense fallback={<Spinner />}>
            <Routes>
              <Route path="/" element={<MainPage />}></Route>
              <Route path="/comics" element={<ComicsPage />}></Route>
              <Route
                path="/comics/:comicId"
                element={<SingleComicPage />}
              ></Route>
              <Route
                path="/characters/:charId"
                element={<SingleCharactorPage />}
              ></Route>
              <Route path="*" element={<Error404 />}></Route>
            </Routes>
          </Suspense>
        </main>
      </div>
    </Router>
  );
};

export default App;
