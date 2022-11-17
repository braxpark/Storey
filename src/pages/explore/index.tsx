import { NextPage } from "next/types";
import Header from "../components/Header";
import {trpc} from "../../utils/trpc";
import {useSession} from "next-auth/react";
import {useRouter} from "next/router";

const Explore: NextPage = () => {
    const router = useRouter();

    return(
        <div className="total-container">
            <Header />
            <div className="content-container">
                <div id="blog-panels-options">
                    <div>Sort By:</div>
                </div>
                <div id="blogpanel-list">
                    
                </div>

            </div>
        </div>
    );
}


export default Explore;