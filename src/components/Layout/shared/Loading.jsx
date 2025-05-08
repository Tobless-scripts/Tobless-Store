import { ClipLoader } from "react-spinners";

function LoadingSpinner() {
    return (
        <>
            <div className="flex w-full h-screen bg-gray-100 dark:bg-[#181d25] flex-col flex-wrap justify-center items-center">
                <div className="h-full flex justify-center items-center">
                    <ClipLoader color="#3B82F6" size={50} />
                </div>
            </div>
        </>
    );
}

export default LoadingSpinner;
