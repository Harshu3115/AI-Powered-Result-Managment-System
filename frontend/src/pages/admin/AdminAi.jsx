import React, { useState } from "react";
import {
    Bot,
    Send,
    Sparkles,
    Users,
    GraduationCap,
    BarChart3,
    BookOpen,
    RefreshCw,
    MessageCircle,
    Lightbulb,
} from "lucide-react";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";
import { adminAiChat } from "../../services/adminAiService";

const AdminAi = () => {
    // =========================================================
    // SIDEBAR STATE
    // =========================================================

    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    // =========================================================
    // AI CHAT STATE
    // =========================================================

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "ai",
            text: "Hello Admin! 👋 I am your SRMS AI Assistant. How can I help you today?",
        },
    ]);

    const [loading, setLoading] = useState(false);

    // =========================================================
    // MOBILE / DESKTOP RESPONSIVE HANDLING
    // =========================================================

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);

        handleResize();

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const handleSend = async (customQuestion = null) => {
        const question = (
            customQuestion ?? message
        ).trim();

        if (!question || loading) {
            return;
        }

        // Add user message immediately
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                type: "user",
                text: question,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            const response = await adminAiChat(question);

            console.log("Admin AI Response:", response);

            const answer =
                response?.data?.answer ||
                response?.data?.message ||
                "I could not generate a response.";

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "ai",
                    text: answer,
                },
            ]);
        } catch (error) {
            console.error("Admin AI Error:", error);

            let errorMessage =
                "Unable to connect to Admin AI.";

            if (error?.response?.status === 401) {
                errorMessage =
                    "Your session has expired. Please login again.";
            } else if (error?.response?.status === 403) {
                errorMessage =
                    "You are not authorized to use Admin AI.";
            } else if (error?.response?.status === 400) {
                errorMessage =
                    error?.response?.data?.message ||
                    "Invalid question.";
            } else if (error?.response?.status === 500) {
                errorMessage =
                    error?.response?.data?.message ||
                    "Server error. Please try again.";
            } else if (error?.response?.data?.message) {
                errorMessage =
                    error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "ai",
                    text: errorMessage,
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // DEMO AI RESPONSE
    // =========================================================



    // =========================================================
    // QUICK QUESTIONS
    // =========================================================

    const quickQuestions = [
        {
            icon: <BarChart3 size={18} />,
            title: "Performance",
            text: "Show me overall academic performance",
        },
        {
            icon: <Users size={18} />,
            title: "Students",
            text: "Give me student statistics",
        },
        {
            icon: <GraduationCap size={18} />,
            title: "Departments",
            text: "Which department has the best performance?",
        },
        {
            icon: <BookOpen size={18} />,
            title: "Subjects",
            text: "Show subject-wise performance",
        },
    ];

    const handleQuickQuestion = (question) => {
        handleSend(question);
    };

    // =========================================================
    // CLEAR CHAT
    // =========================================================

    const clearChat = () => {
        setMessages([
            {
                id: Date.now(),
                type: "ai",
                text: "Hello Admin! 👋 I am your SRMS AI Assistant. How can I help you today?",
            },
        ]);
    };

    // =========================================================
    // ENTER KEY
    // =========================================================

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // =========================================================
    // UI
    // =========================================================

    return (
        <div className="min-h-screen w-full overflow-x-hidden bg-slate-50">

            {/* =================================================
                SIDEBAR
            ================================================= */}

            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* =================================================
                TOPBAR
            ================================================= */}

            <AdminTopbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main
                className={`
                    pt-[72px]
                    min-h-screen
                    transition-all
                    duration-300
                    ${collapsed
                        ? "lg:ml-[76px]"
                        : "lg:ml-[260px]"
                    }
                `}
            >

                <div className="max-w-[1500px] mx-auto p-3 sm:p-4 md:p-6">

                    {/* =================================================
                        PAGE HEADER
                    ================================================= */}

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    h-11
                                    w-11
                                    sm:h-12
                                    sm:w-12
                                    shrink-0
                                    rounded-2xl
                                    bg-gradient-to-br
                                    from-indigo-500
                                    to-violet-600
                                    flex
                                    items-center
                                    justify-center
                                    text-white
                                    shadow-lg
                                    shadow-indigo-200
                                "
                            >
                                <Bot size={24} />
                            </div>

                            <div>
                                <div className="flex items-center gap-2">

                                    <h1
                                        className="
                                            text-xl
                                            sm:text-2xl
                                            font-bold
                                            text-slate-800
                                        "
                                    >
                                        Admin AI Assistant
                                    </h1>

                                    <Sparkles
                                        size={18}
                                        className="text-violet-500"
                                    />

                                </div>

                                <p className="text-sm text-slate-500 mt-0.5">
                                    Intelligent academic management assistant
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={clearChat}
                            className="
                                inline-flex
                                min-h-[42px]
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                font-semibold
                                text-slate-700
                                shadow-sm
                                transition
                                hover:bg-slate-50
                            "
                        >
                            <RefreshCw size={16} />
                            Clear Chat
                        </button>

                    </div>

                    {/* =================================================
                        AI INFO CARDS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            min-[500px]:grid-cols-2
                            lg:grid-cols-4
                            gap-3
                            sm:gap-4
                            mb-5
                            sm:mb-6
                        "
                    >

                        <InfoCard
                            icon={<Users size={20} />}
                            title="Student Analysis"
                            description="Analyze student data"
                            className="bg-blue-50 text-blue-600"
                        />

                        <InfoCard
                            icon={<BarChart3 size={20} />}
                            title="Performance"
                            description="Analyze academic results"
                            className="bg-violet-50 text-violet-600"
                        />

                        <InfoCard
                            icon={<GraduationCap size={20} />}
                            title="Departments"
                            description="Compare departments"
                            className="bg-emerald-50 text-emerald-600"
                        />

                        <InfoCard
                            icon={<BookOpen size={20} />}
                            title="Subjects"
                            description="Analyze subject results"
                            className="bg-orange-50 text-orange-600"
                        />

                    </div>

                    {/* =================================================
                        CHAT + QUICK QUESTIONS
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            xl:grid-cols-[minmax(0,1fr)_330px]
                            gap-5
                        "
                    >

                        {/* =================================================
                            CHAT
                        ================================================= */}

                        <section
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-2xl
                                shadow-sm
                                overflow-hidden
                                min-w-0
                            "
                        >

                            {/* CHAT HEADER */}

                            <div
                                className="
                                    px-4
                                    sm:px-5
                                    py-4
                                    border-b
                                    border-slate-200
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            h-10
                                            w-10
                                            rounded-xl
                                            bg-indigo-50
                                            text-indigo-600
                                            flex
                                            items-center
                                            justify-center
                                        "
                                    >
                                        <MessageCircle size={20} />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-slate-800">
                                            AI Conversation
                                        </h2>

                                        <div className="flex items-center gap-1.5 mt-0.5">

                                            <span
                                                className="
                                                    h-2
                                                    w-2
                                                    rounded-full
                                                    bg-emerald-500
                                                "
                                            />

                                            <span className="text-xs text-slate-400">
                                                AI Assistant Online
                                            </span>

                                        </div>
                                    </div>

                                </div>

                            </div>

                            {/* MESSAGES */}

                            <div
                                className="
                                    h-[420px]
                                    sm:h-[480px]
                                    overflow-y-auto
                                    p-4
                                    sm:p-5
                                    space-y-4
                                    bg-slate-50/60
                                "
                            >

                                {messages.map((item) => (

                                    <div
                                        key={item.id}
                                        className={`
                                            flex
                                            ${item.type === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                            }
                                        `}
                                    >

                                        <div
                                            className={`
                                                flex
                                                items-start
                                                gap-2
                                                max-w-[90%]
                                                sm:max-w-[75%]
                                                ${item.type === "user"
                                                    ? "flex-row-reverse"
                                                    : ""
                                                }
                                            `}
                                        >

                                            {/* AVATAR */}

                                            <div
                                                className={`
                                                    h-8
                                                    w-8
                                                    shrink-0
                                                    rounded-full
                                                    flex
                                                    items-center
                                                    justify-center
                                                    ${item.type === "user"
                                                        ? "bg-indigo-600 text-white"
                                                        : "bg-slate-900 text-white"
                                                    }
                                                `}
                                            >
                                                {item.type === "user" ? (
                                                    <Users size={15} />
                                                ) : (
                                                    <Bot size={16} />
                                                )}
                                            </div>

                                            {/* MESSAGE */}

                                            <div
                                                className={`
        px-4
        py-3
        rounded-2xl
        text-sm
        leading-6
        break-words
        whitespace-pre-line
        ${item.type === "user"
                                                        ? `
                bg-indigo-600
                text-white
                rounded-tr-md
            `
                                                        : `
                bg-white
                border
                border-slate-200
                text-slate-700
                rounded-tl-md
            `
                                                    }
    `}
                                            >
                                                {item.text}
                                            </div>

                                        </div>

                                    </div>

                                ))}

                                {/* LOADING */}

                                {loading && (
                                    <div className="flex justify-start">

                                        <div className="flex items-start gap-2">

                                            <div
                                                className="
                                                    h-8
                                                    w-8
                                                    rounded-full
                                                    bg-slate-900
                                                    text-white
                                                    flex
                                                    items-center
                                                    justify-center
                                                "
                                            >
                                                <Bot size={16} />
                                            </div>

                                            <div
                                                className="
                                                    bg-white
                                                    border
                                                    border-slate-200
                                                    rounded-2xl
                                                    rounded-tl-md
                                                    px-4
                                                    py-3
                                                "
                                            >
                                                <div className="flex gap-1">

                                                    <span className="h-2 w-2 rounded-full bg-slate-400 animate-bounce" />

                                                    <span
                                                        className="
                                                            h-2
                                                            w-2
                                                            rounded-full
                                                            bg-slate-400
                                                            animate-bounce
                                                        "
                                                        style={{
                                                            animationDelay:
                                                                "0.15s",
                                                        }}
                                                    />

                                                    <span
                                                        className="
                                                            h-2
                                                            w-2
                                                            rounded-full
                                                            bg-slate-400
                                                            animate-bounce
                                                        "
                                                        style={{
                                                            animationDelay:
                                                                "0.3s",
                                                        }}
                                                    />

                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                )}

                            </div>

                            {/* INPUT */}

                            <div
                                className="
                                    p-3
                                    sm:p-4
                                    border-t
                                    border-slate-200
                                    bg-white
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-end
                                        gap-2
                                        rounded-2xl
                                        border
                                        border-slate-200
                                        bg-slate-50
                                        p-2
                                        focus-within:border-indigo-400
                                        focus-within:ring-2
                                        focus-within:ring-indigo-100
                                        transition
                                    "
                                >

                                    <textarea
                                        value={message}
                                        onChange={(e) =>
                                            setMessage(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        placeholder="Ask your AI assistant..."
                                        className="
                                            flex-1
                                            resize-none
                                            bg-transparent
                                            outline-none
                                            px-2
                                            py-2
                                            text-sm
                                            text-slate-700
                                            placeholder:text-slate-400
                                            max-h-28
                                        "
                                    />

                                    <button
                                        type="button"
                                        onClick={handleSend}
                                        disabled={
                                            !message.trim() || loading
                                        }
                                        className="
                                            h-10
                                            w-10
                                            shrink-0
                                            rounded-xl
                                            bg-indigo-600
                                            text-white
                                            flex
                                            items-center
                                            justify-center
                                            transition
                                            hover:bg-indigo-700
                                            disabled:opacity-50
                                            disabled:cursor-not-allowed
                                        "
                                        aria-label="Send message"
                                    >
                                        <Send size={17} />
                                    </button>

                                </div>

                                <p className="text-[11px] text-slate-400 mt-2 px-1">
                                    Press Enter to send • Shift + Enter for
                                    new line
                                </p>

                            </div>

                        </section>

                        {/* =================================================
                            QUICK QUESTIONS
                        ================================================= */}

                        <aside
                            className="
                                bg-white
                                border
                                border-slate-200
                                rounded-2xl
                                shadow-sm
                                p-4
                                sm:p-5
                                h-fit
                            "
                        >

                            <div className="flex items-center gap-3 mb-5">

                                <div
                                    className="
                                        h-10
                                        w-10
                                        rounded-xl
                                        bg-amber-50
                                        text-amber-600
                                        flex
                                        items-center
                                        justify-center
                                    "
                                >
                                    <Lightbulb size={20} />
                                </div>

                                <div>
                                    <h2 className="font-semibold text-slate-800">
                                        Quick Questions
                                    </h2>

                                    <p className="text-xs text-slate-400">
                                        Try asking the AI
                                    </p>
                                </div>

                            </div>

                            <div className="space-y-2">

                                {quickQuestions.map(
                                    (question, index) => (

                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() =>
                                                handleQuickQuestion(
                                                    question.text
                                                )
                                            }
                                            className="
                                                w-full
                                                text-left
                                                flex
                                                items-center
                                                gap-3
                                                p-3
                                                rounded-xl
                                                border
                                                border-slate-100
                                                hover:border-indigo-200
                                                hover:bg-indigo-50
                                                transition
                                                group
                                            "
                                        >

                                            <div
                                                className="
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    rounded-lg
                                                    bg-slate-50
                                                    text-slate-500
                                                    group-hover:bg-white
                                                    group-hover:text-indigo-600
                                                    flex
                                                    items-center
                                                    justify-center
                                                    transition
                                                "
                                            >
                                                {question.icon}
                                            </div>

                                            <div className="min-w-0">

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-slate-700
                                                    "
                                                >
                                                    {question.title}
                                                </p>

                                                <p
                                                    className="
                                                        text-xs
                                                        text-slate-400
                                                        mt-0.5
                                                        truncate
                                                    "
                                                >
                                                    {question.text}
                                                </p>

                                            </div>

                                        </button>

                                    )
                                )}

                            </div>

                            {/* AI NOTICE */}

                            <div
                                className="
                                    mt-5
                                    rounded-xl
                                    bg-gradient-to-br
                                    from-indigo-50
                                    to-violet-50
                                    border
                                    border-indigo-100
                                    p-4
                                "
                            >

                                <div className="flex items-start gap-3">

                                    <Sparkles
                                        size={18}
                                        className="
                                            text-indigo-600
                                            mt-0.5
                                            shrink-0
                                        "
                                    />

                                    <div>

                                        <p className="text-sm font-semibold text-slate-700">
                                            AI-powered insights
                                        </p>

                                        <p className="text-xs text-slate-500 leading-5 mt-1">
                                            Ask questions about students,
                                            results, departments, subjects,
                                            and academic performance.
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>

        </div>
    );
};

// =========================================================
// INFO CARD
// =========================================================

const InfoCard = ({
    icon,
    title,
    description,
    className,
}) => {
    return (
        <div
            className="
                bg-white
                border
                border-slate-200
                rounded-2xl
                p-4
                shadow-sm
                flex
                items-center
                gap-3
                min-w-0
            "
        >

            <div
                className={`
                    h-10
                    w-10
                    shrink-0
                    rounded-xl
                    flex
                    items-center
                    justify-center
                    ${className}
                `}
            >
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-sm font-semibold text-slate-700 truncate">
                    {title}
                </p>

                <p className="text-xs text-slate-400 truncate">
                    {description}
                </p>

            </div>

        </div>
    );
};

export default AdminAi;