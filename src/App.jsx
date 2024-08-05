import { RouterProvider } from 'react-router-dom';
import { routers } from '../Routers.jsx';
import { UserProvider } from './contexts/UserContext'; 
import "./App.css";

const App = () => {
  return (
    <UserProvider>
      <RouterProvider router={routers} />
    </UserProvider>
  );
};

export default App;
