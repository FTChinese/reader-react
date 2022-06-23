import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function ContentLayout() {

  return (
    <div className="container">
      <div className="row">

        <div className="col-sm-12 col-md-3" role="navigation">
          <Sidebar />
        </div>

        <div className="col-sm-12 col-md-9">
          <Outlet/>
        </div>
      </div>
    </div>
  );
}


