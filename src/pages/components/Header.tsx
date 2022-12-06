import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
    const { data : sessionData } = useSession();
    const userId = sessionData ? sessionData?.user?.id : -1;
    //replace li {true ... with {sessionData && when auth is setup
    return(
            <div id="header-container">
                <nav>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/explore">Explore</Link>
                        </li>
                        {sessionData && (
                            <li>
                                <Link href={`/user/${userId}/blog`}>Blog</Link>
                            </li>
                        )}
                    </ul>
                </nav>
                <div id="sign-in-container">
                    <button id="sign-in" onClick={sessionData ? () => signOut() : () => signIn()}>
                        {sessionData ? "Logout" : "Login"}
                    </button>
                </div>
            </div>
    );
}

export default Header;