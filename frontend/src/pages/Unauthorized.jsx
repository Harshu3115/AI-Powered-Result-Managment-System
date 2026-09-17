import { useNavigate } from "react-router-dom";

const Unauthorized = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

            <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-md w-full">

                <div className="text-6xl mb-5">
                    🔒
                </div>

                <h1 className="text-3xl font-bold text-gray-900">
                    Access Denied
                </h1>

                <p className="text-gray-500 mt-3">
                    You don't have permission to access this page.
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-7 px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
                >
                    Go Back
                </button>

            </div>

        </div>
    );
};

export default Unauthorized;