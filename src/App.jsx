import { routers } from '../Routers.jsx'
import { RouterProvider } from 'react-router-dom'
import "./App.css";
const App = () => {
  return (
    <RouterProvider router={routers} />
  )
}

export default App;

