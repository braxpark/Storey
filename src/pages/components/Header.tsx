import Link from "next/link";
import { useSession } from "next-auth/react";

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
                        {true && (
                            <li>
                                <Link href="/">Board</Link>
                            </li>
                        )}
                        {true && (
                            <li>
                                <Link href="/">Notes</Link>
                            </li>
                        )}
                        {true && (
                            <li>
                                <Link href="/">Blog</Link>
                            </li>
                        )}
                    </ul>
                </nav>
            </div>
        </>
    );
}

export default Header;