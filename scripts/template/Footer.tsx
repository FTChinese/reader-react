import React from 'react';
import { footerMatrix, IFooterColumn, ILink } from '../lib/footer';

function FooterLinkItem(
  props: {
    href: string;
    name: string;
  }
) {
  return (
    <a
      className='o-footer__matrix-link'
      href={props.href}
      target="__blank"
    >
      {props.name}
    </a>
  );
}

function FooterColumn(
  props: {
    title: string;
    items: ILink[]
  }
) {
  return (
    <div className="col-6 col-md-3 col-lg-2">
      <h6 className="o-footer__matrix-title">
        { props.title }
      </h6>
      <div className="o-footer__matrix-content">
        {
          props.items.map((item, i) => (
            <FooterLinkItem
              key={i}
              name={item.name}
              href={item.href}
            />
          ))
        }
      </div>
    </div>
  );
}

function CopyRight() {

  const yearHolder = '{{footer.Year}}';

  return (
    <div className="o-footer__copyright">
      <small>
        © FT中文网 { yearHolder }.
        <abbr title="Financial Times" aria-label="F T">FT</abbr> and ‘Financial Times’ are trademarks of The Financial Times Ltd.
      </small>
    </div>
  );
}

function AppVersion() {
  const clientHolder = '{{footer.ClientVersion}}';
  const serverHolder = '{{footer.ServerVersion}}';

  return (
    <div className="text-muted pb-3">
      <small>Client v{ clientHolder }. Server { serverHolder}</small>
    </div>
  );
}

export function Footer(
  props: {
    matrix: IFooterColumn[];
  }
) {
  return (
    <footer className="o-footer o-footer--theme-dark">
      <div className="container">
        <div className="row" id="footer">
          {
            props.matrix.map((column, i) => (
              <FooterColumn
                key={i}
                title={column.title}
                items={column.items}
              />
            ))
          }
        </div>
        <CopyRight />
        <AppVersion />
      </div>
    </footer>
  );
}
