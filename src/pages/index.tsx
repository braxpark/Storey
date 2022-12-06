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

  const markStyles = "bg-red-600 hover:underline hover:bg-red-600 hover:rounded-lg hover:font-bold p-1.5 duration-300";
  if(loggedIn)
  {
    displayMessage = (
                      <>
                        Click on <Link href={`/user/${sessionData?.user?.id}/blog`}><mark className={markStyles}>Blog</mark></Link> to get started! 
                      </>
                     );
  }
  else{
    displayMessage = (
                      <>
                        Please <mark className={markStyles} onClick={() => signIn()}>Login</mark>.
                      </>
                     );
  }
  const mainWrapper = (
      <div id="welcome-menu" className={"text-center h-60 bg-white bg-opacity-90 p-12 rounded-lg flex flex-col justify-center items-center"}>
        <div>
          Welcome to Storey!
          <br></br>
          <br></br>
          {displayMessage}
        </div>
      </div>
  )
  return (
    <>
      <Head>
        <title>Storey</title>
        <meta name="Application" content="Application" charSet="utf-8" />
      </Head>
      <main>
        <div className="total-container">
        <Header />
          <div className="absolute left-0 right-0 top-0 bottom-0 m-auto flex flex-col justify-center items-center">
            {mainWrapper}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

