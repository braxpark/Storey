import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

const Header: React.FC = () => {
    const { data : sessionData } = useSession();
    //replace li {true ... with {sessionData && when auth is setup
    return(
        <>
            <div id="header-container">
                <nav>
                    <ul>
                        <li>
                            <Link href="/">Home</Link>
                        </li>
                        <li>
                            <Link href="/">Explore</Link>
                        </li>
                        {sessionData && (
                            <li>
                                <Link href="/">Board</Link>
                            </li>
                        )}
                        {sessionData && (
                            <li>
                                <Link href="/">Notes</Link>
                            </li>
                        )}
                        {sessionData && (
                            <li>
                                <Link href="/blog">Blog</Link>
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
        </>
    );
}

export default Header;