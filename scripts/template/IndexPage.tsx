import React from 'react';
import { Footer } from './Footer';
import { IFooterColumn } from '../lib/data';

export function Index(
  props: {
    baseHref: string;
    bootstrapVersion: string;
    iconBaseUrl: string;
    iconSizes: string[];
    footer?: IFooterColumn[];
    stripe?: boolean;
    gtag?: boolean;
  }
) {
  return (
    <html lang="en">
      <head>
        <base href={`/${props.baseHref}`} />
        <meta charSet="UTF-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <meta
          httpEquiv="X-UA-Compatible"
          content="ie=edge"
        />
        {
          props.iconSizes.map((size, i) => (
            <TouchIcon
              key={i}
              baseUrl={props.iconBaseUrl}
              size={size}
            />
          ))
        }
        <Favicon
          baseUrl={props.iconBaseUrl}
        />
        <link
          href={`https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/${props.bootstrapVersion}/css/bootstrap.min.css`}
          rel="stylesheet"
        />
        <title>用户中心 - FT中文网</title>
        <style
          dangerouslySetInnerHTML={{
            __html: `#root { min-height: 100vh;}`
          }}
        />
        {
          props.stripe &&
          <script type="module" src="https://js.stripe.com/v3/"></script>
        }
        {
          props.gtag &&
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-W2PGS8NT21"></script>
        }
      </head>
      <body>
        <div id="root"></div>
        <Footer
          matrix={props.footer}
        />

        <script type="module" src="/src/main.tsx"></script>
      </body>
    </html>
  )
}

function TouchIcon(
  props: {
    baseUrl: string;
    size: string
  }
) {
  return (
    <link
      rel="apple-touch-icon"
      sizes="{{size}}"
      href={`${props.baseUrl}/apple-touch-icon-${props.size}.png`}
    ></link>
  );
}

function Favicon(
  props: {
    baseUrl: string;
  }
) {
  return (
    <link
      href={`${props.baseUrl}/favicon.ico`}
      type="image/x-icon"
      rel="shortcut icon"
    />
  );
}
