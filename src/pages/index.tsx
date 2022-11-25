import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import Header from "./components/Header";
import { trpc } from "../utils/trpc";
import Link from "next/link";

const Home: NextPage = () => {
  const hello = trpc.example.hello.useQuery({ text: "from tRPC" });
  const {data: sessionData} = useSession();
  const loggedIn = sessionData ? true : false;
  let displayMessage;
  if(loggedIn)
  {
    displayMessage = <div id="main-welcome">Welcome to Storey!<br></br>Click on <Link href={`/user/${sessionData?.user?.id}/blog`}><mark>Blog</mark></Link> to get started!</div>
  }
  else{
    displayMessage = <div id="main-welcome">Weclome to Storey!<br></br>Please <mark onClick={() => signIn()}>Login</mark>.</div>
  }
  return (
    <>
      <Head>
        <title>Storey</title>
        <meta name="Application" content="Application" charSet="utf-8" />
      </Head>
      <main>
        <div className="total-container">
        <Header />
          <div className="content-container flex flex-col justify-center items-center">
            {displayMessage}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

