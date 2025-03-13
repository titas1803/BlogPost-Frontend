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
import { Container } from "react-bootstrap";
import { Search } from "./pages/Search";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchInitialuserDetails } from "./slices/userSlice";
import { AppDispatch } from "./store/store";

const queryClient = new QueryClient();

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchInitialuserDetails());
  }, [dispatch]);

  return (
    <ThemeProvider theme={SiteTheme}>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <Router>
          <Header />
          <main>
            <Container id="page-container">
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route
                    path="/profile/:userid"
                    element={<ProfilePage hasId />}
                  />
                </Route>
                <Route
                  path="/login"
                  element={<LoginOrSignup activePath="login" />}
                />
                <Route
                  path="/signup"
                  element={<LoginOrSignup activePath="signup" />}
                />
                <Route path="/search" element={<Search />} />
                <Route path="/not-allowed" element={<NotAllowed />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </main>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
