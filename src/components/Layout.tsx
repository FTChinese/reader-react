import { Sidebar } from './Sidebar';

export function CenterLayout(
  props: {
    children: JSX.Element
  }
) {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export function ContentLayout(
  props: {
    children: JSX.Element,
  }
) {

  return (
    <div className="container">
      <div className="row">

        <div className="col-sm-3" role="navigation">
          <Sidebar />
        </div>

        <div className="col-sm-9">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export function AuthLayout(
  props: {
    title: string;
    children: JSX.Element;
    links?: JSX.Element;
  }
) {

  return (
    <CenterLayout>
      <>
        <h4 className="text-center">{props.title}</h4>

        {props.children}

        {props.links && <div className="d-flex justify-content-between mt-3">
          {props.links}
        </div>}
      </>
    </CenterLayout>
  );
}
