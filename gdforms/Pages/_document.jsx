import * as React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';


// Now set up the document, and just reset the stylesheet.
export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {

    const page = renderPage((App) => (props) => <App {...props} />);

    return { ...page };
  }

  render() {
    return (
      <Html>
        <Head>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}