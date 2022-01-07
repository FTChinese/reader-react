import 'react-toastify/dist/ReactToastify.min.css';
import { BrowserRouter as Router, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './store/AuthContext';
import { Toolbar } from './components/layout/Toolbar';

function App() {
  return (
    <AuthProvider>
      <Router basename="/reader">
        <Toolbar />
        <div className="page-content pt-3">
          <Outlet />
        </div>

        <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={true}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            draggable
            pauseOnHover
          />
      </Router>
    </AuthProvider>
  );
}

export default App;
