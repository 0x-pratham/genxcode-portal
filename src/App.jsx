import { BrowserRouter as Router } from "react-router-dom";

import ErrorBoundary from "./components/shared/ErrorBoundary";
import { ToastProvider } from "./context/ToastContext";
import { AuthProvider } from "./context/AuthContext";

import Maintenance from "./pages/Maintenance";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <ToastProvider>
            <Maintenance />
          </ToastProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;