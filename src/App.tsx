import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import { NotAllowed, NotFound } from "./pages/Error";
import { Home } from "./pages/Home";
import { LoginOrSignup } from "./pages/LogInOrSignUp";
import { ThemeProvider } from "styled-components";
import { SiteTheme } from "./styles/siteTheme";
import { Header } from "./components/Header";
import { ProtectedRoute } from "./middleware/ProtectedRoute";
import { ProfilePage } from "./pages/ProfilePage";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { Container } from "react-bootstrap";

function App() {
  return (
    <ThemeProvider theme={SiteTheme}>
      <Provider store={store}>
        <Router>
          <Header />
          <main>
            <Container id="page-container">
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/:userid" element={<ProfilePage />} />
                </Route>
                <Route
                  path="/login"
                  element={<LoginOrSignup activePath="login" />}
                />
                <Route
                  path="/signup"
                  element={<LoginOrSignup activePath="signup" />}
                />
                <Route path="/not-allowed" element={<NotAllowed />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </main>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
