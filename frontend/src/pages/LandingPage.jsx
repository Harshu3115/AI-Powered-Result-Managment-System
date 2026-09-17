import React from "react";
import { useNavigate } from "react-router-dom";
import {
    GraduationCap,
    Users,
    ShieldCheck,
} from "lucide-react";

const LandingPage = () => {

    const navigate = useNavigate();

    const portals = [
        {
            title: "STUDENT LOGIN",
            role: "STUDENT",
            icon: GraduationCap,
        },
        {
            title: "TEACHER LOGIN",
            role: "TEACHER",
            icon: Users,
        },
        {
            title: "ADMIN LOGIN",
            role: "ADMIN",
            icon: ShieldCheck,
        },
    ];

    return (
        <div className="min-h-screen relative flex flex-col">

            {/* Background Image */}

            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: "url('/slider-1.jpg')",
                }}
            />

            {/* Black Overlay */}

            <div className="absolute inset-0 bg-black/75" />


            {/* Content */}

            <div className="relative z-10 min-h-screen flex flex-col">


                {/* Header */}

                <header className="bg-black/70 py-4">

                    <h1 className="text-center text-3xl font-bold text-white">
                        AI POWERED SRMS
                    </h1>

                </header>


                {/* Main */}

                <main className="flex-1 flex items-center justify-center px-6">

                    <div className="w-full max-w-5xl">

                        <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-10">
                            Welcome to Student Result Management System
                        </h2>


                        {/* Login Boxes */}

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {portals.map((portal) => {

                                const Icon = portal.icon;

                                return (

                                    <button
                                        key={portal.title}
                                        onClick={() =>
                                            navigate("/login", {
                                                state: {
                                                    role: portal.role,
                                                },
                                            })
                                        }
                                        className="
        h-52
        bg-white/95
        border-2
        border-white
        rounded-lg
        flex
        flex-col
        items-center
        justify-center
        shadow-xl
        transition
        hover:bg-white
        hover:-translate-y-1
    "
                                    >

                                        <div className="mb-4 text-indigo-600">

                                            <Icon size={42} />

                                        </div>

                                        <h3 className="text-xl font-bold text-slate-800">

                                            {portal.title}

                                        </h3>

                                        <p className="mt-2 text-sm text-slate-500">

                                            Click to continue

                                        </p>

                                    </button>

                                );

                            })}

                        </div>

                    </div>

                </main>


                {/* Footer */}

                <footer className="bg-black/80 py-4 text-center">

                    <p className="text-white font-semibold">
                        AI Powered Student Result Management System
                    </p>

                    <p className="text-white/50 text-xs mt-1">
                        © 2026 SRMS • All Rights Reserved
                    </p>

                </footer>

            </div>

        </div>
    );
};

export default LandingPage;