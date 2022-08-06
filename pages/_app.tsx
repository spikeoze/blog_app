import Router from "next/router";
import Head from "next/head";
import NProgress from "nprogress";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  NProgress.configure({ showSpinner: false });

  Router.events.on("routeChangeStart", () => {
    NProgress.start();
  });

  Router.events.on("routeChangeComplete", () => {
    NProgress.done();
  });
  return (
    <>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
