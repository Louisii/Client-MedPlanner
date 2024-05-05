import AuthProvider from "./lib/AuthProvider";
import Routes from "./routes/Route";

const App = () => {

  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;