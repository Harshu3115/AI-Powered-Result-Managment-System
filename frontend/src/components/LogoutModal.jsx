import React from "react";
import { AlertTriangle, X } from "lucide-react";

const LogoutModal = ({
    isOpen,
    onConfirm,
    onCancel,
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="
                fixed
                inset-0
                z-[9999]
                flex
                items-center
                justify-center
                bg-black/40
                backdrop-blur-sm
                p-4
                animate-[fadeIn_0.2s_ease-out]
            "
        >
            <div
                className="
                    relative
                    w-full
                    max-w-md
                    
                    bg-white
                    px-8
                    pb-8
                    pt-10
                    text-center
                    shadow-2xl
                    animate-[modalPop_0.35s_ease-out]
                "
            >
                {/* CLOSE BUTTON */}
                <button
                    type="button"
                    onClick={onCancel}
                    className="
                        absolute
                        right-4
                        top-4
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        text-slate-400
                        transition
                        hover:bg-slate-100
                        hover:text-slate-600
                    "
                >
                    <X size={18} />
                </button>

                {/* WARNING ICON */}
                <div className="flex justify-center">
                    <div
                        className="
                            flex
                            h-28
                            w-28
                            items-center
                            justify-center
                            rounded-full
                            border-4
                            border-orange-300
                            animate-[warningPulse_1.5s_ease-in-out_infinite]
                        "
                    >
                        <AlertTriangle
                            size={52}
                            strokeWidth={2}
                            className="text-orange-300"
                        />
                    </div>
                </div>

                {/* TITLE */}
                <h2
                    className="
                        mt-7
                        text-3xl
                        font-bold
                        text-slate-600
                    "
                >
                    Are you sure?
                </h2>

                {/* MESSAGE */}
                <p
                    className="
                        mt-3
                        text-lg
                        text-slate-500
                    "
                >
                    You will be logged out!
                </p>

                {/* BUTTONS */}
                <div
                    className="
                        mt-8
                        flex
                        justify-center
                        gap-3
                    "
                >
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="
                            rounded-lg
                            bg-indigo-500
                            px-6
                            py-3
                            text-base
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-indigo-600
                            hover:shadow-md
                            active:scale-95
                        "
                    >
                        Yes, logout
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        className="
                            rounded-lg
                            bg-slate-500
                            px-6
                            py-3
                            text-base
                            font-semibold
                            text-white
                            shadow-sm
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-slate-600
                            hover:shadow-md
                            active:scale-95
                        "
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* ANIMATIONS */}
            <style>
                {`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }
                        to {
                            opacity: 1;
                        }
                    }

                    @keyframes modalPop {
                        0% {
                            opacity: 0;
                            transform: scale(0.7) translateY(25px);
                        }

                        60% {
                            opacity: 1;
                            transform: scale(1.04) translateY(-3px);
                        }

                        100% {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                        }
                    }

                    @keyframes warningPulse {
                        0%,
                        100% {
                            transform: scale(1);
                        }

                        50% {
                            transform: scale(1.08);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default LogoutModal;