import { useAuth } from "./AuthContext";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  const { user } = useAuth();

  return user ? <Dashboard /> : <Login />;
}

export default App;