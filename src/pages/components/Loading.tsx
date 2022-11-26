const Loading: React.FC = () => {
    const spinner = (
            <div className={"content-spinner"}>
            <div className={"dot"}></div>
            <div className={"dot"}></div>
            <div className={"dot"}></div>
            <div className={"dot"}></div>
            <div className={"dot"}></div>
            <div className={"dot"}></div>
            <div className={"dot"}></div>
            <div className={"dot"}></div>
            </div>
        );

        const message = (
            <div className={"bg-transparent w-full h-full absolute text-white flex flex-col justify-center items-center"}>
                <h1 className={"mb-16 font-bold text-2xl"}>Loading..</h1>
            </div>
        );
    return(
        <>
            {message}
        </>
    );
}
export default Loading;