import React, { useEffect, useState } from "react";

import TeacherSidebar from "../../components/TeacherSidebar";
import TeacherTopbar from "../../components/TeacherTopbar";

import teacherService from "../../services/teacherService";

import {
    Bot,
    Send,
    BarChart3,
    AlertTriangle,
    FileText,
    BookOpen,
    Users,
    Sparkles,
    Loader2,
    MessageSquare,
    RefreshCw,
} from "lucide-react";

import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const TeacherAI = () => {

    // =========================================================
    // DASHBOARD / SIDEBAR STATE
    // =========================================================

    const [dashboard, setDashboard] = useState(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [sidebarCollapsed, setSidebarCollapsed] =
        useState(false);

    const [loadingDashboard, setLoadingDashboard] =
        useState(true);


    // =========================================================
    // CHAT STATE
    // =========================================================

    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const [sending, setSending] = useState(false);


    // =========================================================
    // FETCH TEACHER DASHBOARD
    // =========================================================

    const fetchDashboard = async () => {

        try {

            setLoadingDashboard(true);

            const response =
                await teacherService.getDashboard();

            console.log(
                "Teacher AI Dashboard Response:",
                response
            );

            if (response?.success) {

                setDashboard(response.data);

            } else {

                throw new Error(
                    response?.message ||
                    "Unable to load teacher information."
                );

            }

        } catch (error) {

            console.error(
                "Teacher AI Dashboard Error:",
                error
            );

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load teacher information."
            );

        } finally {

            setLoadingDashboard(false);

        }

    };


    // =========================================================
    // LOAD DASHBOARD
    // =========================================================

    useEffect(() => {

        fetchDashboard();

    }, []);


    // =========================================================
    // SEND MESSAGE TO AI
    // =========================================================

    const sendMessage = async (question = message) => {

        const text = question?.trim();

        if (!text) {
            return;
        }

        if (sending) {
            return;
        }

        // -----------------------------------------------------
        // ADD USER MESSAGE
        // -----------------------------------------------------

        const userMessage = {
            id: Date.now(),
            type: "user",
            text: text,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        setMessage("");

        setSending(true);

        try {

            console.log(
                "Teacher AI Question:",
                text
            );


            // -------------------------------------------------
            // CALL BACKEND AI
            // -------------------------------------------------

            const response =
                await teacherService.teacherAIChat(text);


            console.log(
                "Teacher AI Response:",
                response
            );


            if (!response?.success) {

                throw new Error(
                    response?.message ||
                    "AI was unable to generate a response."
                );

            }


            // -------------------------------------------------
            // GET AI ANSWER
            // -------------------------------------------------

            const answer =
                response?.data?.answer ||
                "I could not generate a response.";


            // -------------------------------------------------
            // ADD AI MESSAGE
            // -------------------------------------------------

            const aiMessage = {
                id: Date.now() + 1,
                type: "ai",
                text: answer,
            };


            setMessages((prev) => [
                ...prev,
                aiMessage,
            ]);


        } catch (error) {

            console.error(
                "Teacher AI Error:",
                error
            );


            const errorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Unable to connect with AI.";


            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "ai",
                    text: `Sorry, I couldn't process your request. ${errorMessage}`,
                },
            ]);


            toast.error(errorMessage);

        } finally {

            setSending(false);

        }

    };


    // =========================================================
    // ENTER KEY
    // =========================================================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();

        }

    };


    // =========================================================
    // QUICK ACTION
    // =========================================================

    const handleQuickAction = (text) => {

        sendMessage(text);

    };


    // =========================================================
    // CLEAR CHAT
    // =========================================================

    const clearChat = () => {

        setMessages([]);

        toast.success(
            "AI conversation cleared."
        );

    };


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="min-h-screen bg-slate-50">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <TeacherSidebar

                open={sidebarOpen}

                onClose={() =>
                    setSidebarOpen(false)
                }

                collapsed={sidebarCollapsed}

            />


            {/* =================================================
                MAIN AREA
            ================================================= */}

            <div
                className={`
                    min-h-screen
                    w-full
                    transition-all
                    duration-300
                    ${sidebarCollapsed
                        ? "lg:pl-20"
                        : "lg:pl-72"
                    }
                `}
            >


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <TeacherTopbar

                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }

                    onSidebarToggle={() =>
                        setSidebarCollapsed(
                            (prev) => !prev
                        )
                    }

                    sidebarCollapsed={
                        sidebarCollapsed
                    }

                    dashboardData={
                        dashboard
                    }

                    title="Teacher AI"

                />


                {/* =================================================
                    MAIN CONTENT
                ================================================= */}

                <main className="w-full px-6 pt-[96px] pb-7 sm:px-8 lg:px-10">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <section className="mb-6">

                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

                            <div>

                                <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
                                    AI Tools
                                </p>

                                <h1 className="mt-1 text-3xl font-bold text-slate-900 md:text-4xl">
                                    Teacher AI Assistant
                                </h1>

                                <p className="mt-2 max-w-2xl text-sm text-slate-500 md:text-base">
                                    Analyze your assigned subjects,
                                    student performance and teaching
                                    data using AI.
                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={clearChat}
                                disabled={
                                    messages.length === 0
                                }
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-white
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                    shadow-sm
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >

                                <RefreshCw
                                    size={17}
                                />

                                Clear Chat

                            </button>

                        </div>

                    </section>


                    {/* =================================================
                        AI HERO
                    ================================================= */}

                    <section className="mb-6">

                        <div className="
                            overflow-hidden
                            rounded-2xl
                            bg-gradient-to-r
                            from-indigo-600
                            via-blue-600
                            to-violet-600
                            p-6
                            text-white
                            shadow-lg
                            md:p-8
                        ">

                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

                                <div className="flex items-start gap-4">

                                    <div className="
                                        flex
                                        h-14
                                        w-14
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-white/15
                                    ">

                                        <Bot
                                            size={30}
                                        />

                                    </div>


                                    <div>

                                        <div className="flex items-center gap-2">

                                            <h2 className="text-xl font-bold md:text-2xl">
                                                AI Teaching Assistant
                                            </h2>

                                            <Sparkles
                                                size={19}
                                            />

                                        </div>


                                        <p className="
                                            mt-2
                                            max-w-2xl
                                            text-sm
                                            leading-6
                                            text-indigo-100
                                            md:text-base
                                        ">
                                            Ask questions about your
                                            students, subjects, results,
                                            weak areas and teaching
                                            strategies.
                                        </p>

                                    </div>

                                </div>


                                <div className="
                                    rounded-xl
                                    bg-white/10
                                    px-4
                                    py-3
                                    text-sm
                                    text-indigo-100
                                ">

                                    {loadingDashboard
                                        ? "Loading teacher data..."
                                        : `Welcome, ${dashboard?.teacherName ||
                                        "Teacher"
                                        }`
                                    }

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <section className="mb-6">

                        <div className="mb-4">

                            <h2 className="text-lg font-bold text-slate-900">
                                AI Quick Actions
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Ask AI common teaching and academic
                                questions.
                            </p>

                        </div>


                        <div className="
                            grid
                            grid-cols-1
                            gap-4
                            sm:grid-cols-2
                            lg:grid-cols-4
                        ">


                            {/* CLASS ANALYSIS */}

                            <QuickAction
                                icon={BarChart3}
                                title="Class Analysis"
                                description="Analyze overall class performance"
                                iconClass="bg-indigo-50 text-indigo-600"
                                onClick={() =>
                                    handleQuickAction(
                                        "Analyze my overall class performance. Identify strong and weak subjects, important performance patterns, and give practical recommendations."
                                    )
                                }
                            />


                            {/* WEAK STUDENTS */}

                            <QuickAction
                                icon={AlertTriangle}
                                title="Weak Students"
                                description="Find students needing support"
                                iconClass="bg-amber-50 text-amber-600"
                                onClick={() =>
                                    handleQuickAction(
                                        "Identify students who need improvement based on their marks and performance. Explain why they need attention and suggest how I can support them."
                                    )
                                }
                            />


                            {/* QUESTION PAPER */}

                            <QuickAction
                                icon={FileText}
                                title="Question Paper"
                                description="Generate a question paper"
                                iconClass="bg-emerald-50 text-emerald-600"
                                onClick={() =>
                                    handleQuickAction(
                                        "Help me create a question paper based on my assigned subjects. Suggest questions with a balanced difficulty level and appropriate academic coverage."
                                    )
                                }
                            />


                            {/* STUDY PLAN */}

                            <QuickAction
                                icon={BookOpen}
                                title="Study Plan"
                                description="Create a student study plan"
                                iconClass="bg-violet-50 text-violet-600"
                                onClick={() =>
                                    handleQuickAction(
                                        "Create a practical study plan for students who are performing poorly. Focus on improving weak subjects and maintaining strong subjects."
                                    )
                                }
                            />

                        </div>

                    </section>


                    {/* =================================================
                        CHAT
                    ================================================= */}

                    <section className="
                        overflow-hidden
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    ">


                        {/* CHAT HEADER */}

                        <div className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-slate-100
                            px-6
                            py-5
                        ">

                            <div className="flex items-center gap-3">

                                <div className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-indigo-50
                                    text-indigo-600
                                ">

                                    <MessageSquare
                                        size={21}
                                    />

                                </div>


                                <div>

                                    <h2 className="font-bold text-slate-900">
                                        AI Conversation
                                    </h2>

                                    <p className="text-xs text-slate-500">
                                        Your AI-powered teaching assistant
                                    </p>

                                </div>

                            </div>


                            <div className="
                                hidden
                                rounded-full
                                bg-emerald-50
                                px-3
                                py-1.5
                                text-xs
                                font-semibold
                                text-emerald-600
                                sm:block
                            ">

                                ● AI Ready

                            </div>

                        </div>


                        {/* =================================================
                            MESSAGES
                        ================================================= */}

                        <div className="
                            h-[500px]
                            space-y-5
                            overflow-y-auto
                            p-6
                        ">


                            {/* EMPTY STATE */}

                            {messages.length === 0 && (

                                <div className="
                                    flex
                                    h-full
                                    min-h-[380px]
                                    flex-col
                                    items-center
                                    justify-center
                                    text-center
                                ">

                                    <div className="
                                        mb-5
                                        flex
                                        h-16
                                        w-16
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-indigo-50
                                        text-indigo-600
                                    ">

                                        <Bot
                                            size={30}
                                        />

                                    </div>


                                    <h3 className="
                                        text-xl
                                        font-bold
                                        text-slate-800
                                    ">
                                        How can I help you?
                                    </h3>


                                    <p className="
                                        mt-2
                                        max-w-lg
                                        text-sm
                                        leading-6
                                        text-slate-500
                                    ">
                                        Ask me about your students,
                                        assigned subjects, results,
                                        weak performers, class analysis
                                        or teaching strategies.
                                    </p>

                                </div>

                            )}


                            {/* =================================================
                                CHAT MESSAGES
                            ================================================= */}

                            {messages.map((msg) => (

                                <div
                                    key={msg.id}
                                    className={`
                                        flex
                                        ${msg.type === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                        }
                                    `}
                                >

                                    <div
                                        className={`
                                            flex
                                            max-w-[85%]
                                            items-start
                                            gap-3
                                            ${msg.type === "user"
                                                ? "flex-row-reverse"
                                                : ""
                                            }
                                        `}
                                    >


                                        {/* ICON */}

                                        <div className={`
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            ${msg.type === "user"
                                                ? "bg-indigo-600 text-white"
                                                : "bg-indigo-50 text-indigo-600"
                                            }
                                        `}>

                                            {msg.type === "user"
                                                ? <Users size={16} />
                                                : <Bot size={18} />
                                            }

                                        </div>


                                        {/* MESSAGE */}

                                        <div
                                            className={`
                                                whitespace-pre-wrap
                                                rounded-2xl
                                                px-4
                                                py-3
                                                text-sm
                                                leading-6
                                                ${msg.type === "user"
                                                    ? "rounded-tr-md bg-indigo-600 text-white"
                                                    : "rounded-tl-md bg-slate-100 text-slate-700"
                                                }
                                            `}
                                        >

                                            {msg.text}

                                        </div>

                                    </div>

                                </div>

                            ))}


                            {/* =================================================
                                AI LOADING
                            ================================================= */}

                            {sending && (

                                <div className="flex justify-start">

                                    <div className="
                                        flex
                                        items-center
                                        gap-3
                                        rounded-2xl
                                        rounded-tl-md
                                        bg-slate-100
                                        px-4
                                        py-3
                                    ">

                                        <Loader2
                                            size={18}
                                            className="animate-spin text-indigo-600"
                                        />

                                        <span className="
                                            text-sm
                                            text-slate-500
                                        ">
                                            AI is analyzing your request...
                                        </span>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* =================================================
                            INPUT
                        ================================================= */}

                        <div className="
                            border-t
                            border-slate-100
                            bg-slate-50/50
                            p-4
                        ">

                            <div className="
                                flex
                                items-end
                                gap-3
                            ">

                                <textarea
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={
                                        handleKeyDown
                                    }
                                    disabled={sending}
                                    rows={2}
                                    placeholder="Ask AI about your students, subjects or results..."
                                    className="
                                        min-h-[50px]
                                        flex-1
                                        resize-none
                                        rounded-xl
                                        border
                                        border-slate-200
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        text-slate-700
                                        outline-none
                                        transition
                                        focus:border-indigo-500
                                        focus:ring-2
                                        focus:ring-indigo-100
                                        disabled:bg-slate-100
                                    "
                                />


                                <button
                                    type="button"
                                    onClick={() =>
                                        sendMessage()
                                    }
                                    disabled={
                                        sending ||
                                        !message.trim()
                                    }
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-indigo-600
                                        text-white
                                        shadow-sm
                                        transition
                                        hover:bg-indigo-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {sending ? (

                                        <Loader2
                                            size={20}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Send
                                            size={19}
                                        />

                                    )}

                                </button>

                            </div>


                            <p className="
                                mt-2
                                text-center
                                text-[11px]
                                text-slate-400
                            ">
                                Press Enter to send • Shift + Enter for a new line
                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <footer className="
                        mt-10
                        border-t
                        border-slate-200
                        py-6
                        text-center
                    ">

                        <p className="text-sm text-slate-500">
                            AI Powered Student Result Management System
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                            © 2026 SRMS • Teacher Portal
                        </p>

                    </footer>


                </main>

            </div>


            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="colored"
            />

        </div>

    );

};


// =============================================================
// QUICK ACTION COMPONENT
// =============================================================

const QuickAction = ({
    icon: Icon,
    title,
    description,
    iconClass,
    onClick,
}) => {

    return (

        <button
            type="button"
            onClick={onClick}
            className="
                group
                flex
                items-center
                gap-4
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                text-left
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:border-indigo-200
                hover:shadow-md
            "
        >

            <div
                className={`
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    ${iconClass}
                `}
            >

                <Icon
                    size={21}
                />

            </div>


            <div className="min-w-0">

                <h3 className="
                    font-semibold
                    text-slate-800
                ">
                    {title}
                </h3>

                <p className="
                    mt-1
                    text-xs
                    text-slate-400
                ">
                    {description}
                </p>

            </div>

        </button>

    );

};


export default TeacherAI;