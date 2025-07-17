import UserCall from './components/UserCall';
import AdminCall from './components/AdminCall';
import { BrowserRouter,Route,Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserCall />} />
        <Route path="/admin-call" element={<AdminCall />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
