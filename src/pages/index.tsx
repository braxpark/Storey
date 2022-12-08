import { type NextPage } from "next";
import Head from "next/head";
import { signIn, useSession } from "next-auth/react";
import Header from "./components/Header";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import {useEffect} from "react";

const Home: NextPage = () => {
  //onmousemove = (e: any) => console.log("mouse location: ", e.x, e.y)
  const {data: sessionData} = useSession();
  const loggedIn = sessionData ? true : false;
  let displayMessage;

  useEffect(() => {
      onmousemove = (e: any) => {
          const xVal = e.x - 25 >= 0 ? e.x - 25 : -50;
          const yVal = e.y - 25 >= 0 ? e.y - 25 : -50;
          if(document.getElementById("mouse-cursor") != null) document.getElementById("mouse-cursor")!.style.left = (xVal + "px");
          if(document.getElementById("mouse-cursor") != null) document.getElementById("mouse-cursor")!.style.top = (yVal + "px");
      }
  },)

  const markStyles = "bg-red-600 bg-opacity-80 font-bold cursor-pointer hover:underline hover:rounded-lg p-1.5 duration-300";
  if(loggedIn)
  {
    displayMessage = (
                      <div className={"p-4"}>
                        <Link href={`/user/${sessionData?.user?.id}/blog`}><mark className={markStyles}>Blog</mark></Link> to get started writing. 
                        <br></br>
                        <br></br>
                        <Link href={"/explore/"}><mark className={markStyles}>Explore</mark></Link> to see our community&#39;s posts.
                      </div>
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
      <div id="welcome-menu" className={"text-center h-60 bg-white p-12 rounded-lg"}>
        <div className={"w-full"}>
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
        <div className={"absolute"} id="mouse-cursor" />
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

