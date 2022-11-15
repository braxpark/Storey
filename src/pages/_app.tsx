import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import "../styles/main.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  useEffect(() => {
    document.documentElement.setAttribute("color-mode", "light");
  }, []);
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
