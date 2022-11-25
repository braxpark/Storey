import {NextPage} from "next";
import { useRouter } from "next/router";
const Unallowed: NextPage = () => {
    const router = useRouter();
    function redirectToHome() {
        router.push("/")
    }
    return(
        <>
            <div className={"bg-black w-screen h-screen text-white flex flex-col justify-center items-center"}>
                <p>Unauthorized</p>
                <button onClick={redirectToHome} className={"border-2 border-solid border-white rounded-lg p-2 pl-4 pr-4 hover:bg-white hover:text-black duration-150"}>Home</button>
            </div>
        </>
    );
}

export default Unallowed;