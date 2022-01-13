import 'react-toastify/dist/ReactToastify.min.css';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Toolbar } from './components/layout/Toolbar';

function App() {
  return (
    <>
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
    </>
  );
}

export default App;
