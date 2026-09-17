import React, { useEffect, useRef, useState } from "react";
import {
    Bot,
    Send,
    Sparkles,
    User,
    Trash2,
    MessageCircle,
    Loader2,
} from "lucide-react";

import StudentSidebar from "../../components/StudentSidebar";
import StudentTopbar from "../../components/StudentTopbar";
import studentService from "../../services/studentService";

const AIAssistant = () => {

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const [dashboardData, setDashboardData] = useState(null);

    const [messages, setMessages] = useState([]);

    const [question, setQuestion] = useState("");

    const [loading, setLoading] = useState(true);

    const [sending, setSending] = useState(false);

    const messagesEndRef = useRef(null);


    const [profile, setProfile] = useState(null);


    // =========================================================
    // LOAD STUDENT DATA
    // =========================================================

    useEffect(() => {

        loadStudentData();

    }, []);


    const loadStudentData = async () => {
        try {
            setLoading(true);

            const [
                dashboardResponse,
                profileResponse,
            ] = await Promise.all([
                studentService.getDashboard(),
                studentService.getProfile(),
            ]);

            console.log(
                "AI Assistant Dashboard API:",
                dashboardResponse
            );

            console.log(
                "AI Assistant Profile API:",
                profileResponse
            );

            // Dashboard data
            if (dashboardResponse?.success) {
                setDashboardData(dashboardResponse.data);
            } else {
                setDashboardData(
                    dashboardResponse?.data ||
                    dashboardResponse ||
                    null
                );
            }

            // Profile data
            if (profileResponse?.success) {
                setProfile(profileResponse.data);
            } else {
                setProfile(
                    profileResponse?.data ||
                    profileResponse ||
                    null
                );
            }

        } catch (error) {
            console.error(
                "Student Data API Error:",
                error
            );
        } finally {
            setLoading(false);
        }
    };


    // =========================================================
    // AUTO SCROLL
    // =========================================================

    useEffect(() => {

        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });

    }, [messages, sending]);


    // =========================================================
    // SEND MESSAGE
    // =========================================================

    const sendMessage = async () => {

        const trimmedQuestion =
            question.trim();

        if (!trimmedQuestion || sending) {
            return;
        }


        // Add user message

        const userMessage = {
            id: Date.now(),
            role: "user",
            content: trimmedQuestion,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        setQuestion("");

        setSending(true);


        try {

            console.log(
                "AI Question:",
                trimmedQuestion
            );


            const response =
                await studentService.chat(
                    trimmedQuestion
                );


            console.log(
                "AI Chat Response:",
                response
            );


            // =================================================
            // EXTRACT AI RESPONSE
            // =================================================

            const aiAnswer =
                response?.data?.answer ||
                response?.data?.response ||
                response?.data?.message ||
                response?.answer ||
                response?.response ||
                response?.message ||
                "Sorry, I couldn't generate a response.";


            const aiMessage = {

                id: Date.now() + 1,

                role: "assistant",

                content: aiAnswer,

            };


            setMessages((prev) => [
                ...prev,
                aiMessage,
            ]);

        } catch (error) {

            console.error(
                "AI Assistant Error:",
                error
            );


            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    role: "assistant",
                    content:
                        error?.response?.data?.message ||
                        "Unable to connect to the AI assistant. Please try again.",
                },
            ]);

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
    // SUGGESTED QUESTIONS
    // =========================================================

    const suggestions = [

        "How can I improve my CGPA?",

        "Which subjects should I focus on?",

        "Analyze my recent performance.",

        "Create a study plan for me.",

    ];


    const useSuggestion = (text) => {

        setQuestion(text);

    };


    // =========================================================
    // CLEAR CHAT
    // =========================================================

    const clearChat = () => {

        setMessages([]);

    };


    // =========================================================
    // GET INITIALS
    // =========================================================

    const getInitials = (name) => {

        if (!name) {
            return "ST";
        }

        const parts =
            name.trim().split(/\s+/);

        if (parts.length === 1) {

            return parts[0]
                .charAt(0)
                .toUpperCase();

        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();

    };


    // =========================================================
    // STUDENT NAME
    // =========================================================

    const studentName =
        dashboardData?.studentName ||
        [
            dashboardData?.firstName,
            dashboardData?.lastName,
        ]
            .filter(Boolean)
            .join(" ") ||
        "Student";


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="flex min-h-screen bg-slate-50">

                <StudentSidebar
                    open={sidebarOpen}
                    collapsed={sidebarCollapsed}
                    onClose={() => setSidebarOpen(false)}
                />

                <div
                    className={`
        min-h-screen
        min-w-0
        flex-1
        transition-all
        duration-300
        ${sidebarCollapsed
                            ? "lg:ml-20"
                            : "lg:ml-70"
                        }
    `}
                >

                    <StudentTopbar
                        onMenuClick={() => setSidebarOpen(true)}
                        onSidebarToggle={() =>
                            setSidebarCollapsed((prev) => !prev)
                        }
                        sidebarCollapsed={sidebarCollapsed}
                        dashboardData={dashboardData}
                        profile={profile}
                    />

                    <main className="flex min-h-screen flex-1 items-center justify-center pt-16">

                        <div className="flex items-center gap-3 text-sm text-slate-500">

                            <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />

                            Loading AI Assistant...

                        </div>

                    </main>

                </div>

            </div>

        );

    }


    // =========================================================
    // MAIN UI
    // =========================================================

    return (

        <div className="flex min-h-screen bg-slate-50">


            {/* =================================================
                SIDEBAR
            ================================================= */}

            <StudentSidebar
                open={sidebarOpen}
                collapsed={sidebarCollapsed}
                onClose={() => setSidebarOpen(false)}
            />


            {/* =================================================
                CONTENT
            ================================================= */}

            <div
                className={`
        min-h-screen
        min-w-0
        flex-1
        transition-all
        duration-300
        ${sidebarCollapsed
                        ? "lg:ml-20"
                        : "lg:ml-70"
                    }
    `}
            >


                {/* =================================================
                    TOPBAR
                ================================================= */}

                <StudentTopbar
                    onMenuClick={() => setSidebarOpen(true)}
                    onSidebarToggle={() =>
                        setSidebarCollapsed((prev) => !prev)
                    }
                    sidebarCollapsed={sidebarCollapsed}
                    dashboardData={dashboardData}
                    profile={profile}
                />


                {/* =================================================
                    MAIN
                ================================================= */}

                <main className="min-w-0 flex-1 px-4 pb-6 pt-20 sm:px-6 lg:px-8">

                    <div className="mx-auto flex w-full max-w-[1400px] flex-1 flex-col">

                        {/* AI HEADER */}
                        <div className="mb-8 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 p-5 text-white shadow-md">

                            <div className="flex items-center justify-between gap-4">

                                <div className="flex items-center gap-3">

                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                                        <Sparkles className="h-5 w-5" />
                                    </div>

                                    <div>
                                        <h1 className="text-xl font-extrabold">
                                            AI Assistant
                                        </h1>

                                        <p className="mt-1 text-xs text-pink-100">
                                            Your personal academic assistant
                                        </p>
                                    </div>

                                </div>

                                {messages.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearChat}
                                        className="flex shrink-0 items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-xs font-semibold transition hover:bg-white/25"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Clear
                                    </button>
                                )}

                            </div>

                        </div>


                        {/* CHAT CONTAINER */}
                        <section className="flex min-h-[650px] flex-1 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                            {/* CHAT HEADER */}
                            <div className="flex shrink-0 items-center gap-3 border-b border-slate-100 px-5 py-4">

                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                    <Bot className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-sm font-bold text-slate-800">
                                        SRMS AI Assistant
                                    </p>

                                    <p className="text-xs text-emerald-500">
                                        Online
                                    </p>
                                </div>

                            </div>


                            {/* CHAT AREA */}
                            <div className="min-h-0 flex-1 overflow-y-auto p-5">

                                {/* EMPTY STATE */}
                                {messages.length === 0 && (
                                    <div className="flex min-h-[500px] flex-col items-center justify-center px-4 text-center">

                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50">
                                            <MessageCircle className="h-8 w-8 text-indigo-600" />
                                        </div>

                                        <h2 className="mt-5 text-xl font-bold text-slate-800">
                                            Hi {studentName.split(" ")[0]} 👋
                                        </h2>

                                        <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
                                            Ask me anything about your academic performance,
                                            subjects, CGPA, study plan or exam preparation.
                                        </p>

                                        {/* SUGGESTIONS */}
                                        <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">

                                            {suggestions.map((suggestion) => (
                                                <button
                                                    key={suggestion}
                                                    type="button"
                                                    onClick={() => useSuggestion(suggestion)}
                                                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-left text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                                                >
                                                    {suggestion}
                                                </button>
                                            ))}

                                        </div>

                                    </div>
                                )}


                                {/* MESSAGES */}
                                <div className="space-y-6">

                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex items-start gap-3 ${message.role === "user"
                                                ? "justify-end"
                                                : "justify-start"
                                                }`}
                                        >

                                            {message.role !== "user" && (
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                    <Bot className="h-4 w-4" />
                                                </span>
                                            )}

                                            <div
                                                className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user"
                                                    ? "rounded-tr-sm bg-indigo-600 text-white"
                                                    : "rounded-tl-sm bg-slate-50 text-slate-600"
                                                    }`}
                                            >
                                                {message.content}
                                            </div>

                                            {message.role === "user" && (
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                                                    {getInitials(studentName)}
                                                </span>
                                            )}

                                        </div>
                                    ))}


                                    {/* TYPING */}
                                    {sending && (
                                        <div className="flex items-start gap-3">

                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                <Bot className="h-4 w-4" />
                                            </span>

                                            <div className="flex items-center gap-2 rounded-2xl rounded-tl-sm bg-slate-50 px-4 py-3">
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                                                <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                                            </div>

                                        </div>
                                    )}

                                </div>

                                <div ref={messagesEndRef} />

                            </div>


                            {/* INPUT */}
                            <div className="shrink-0 border-t border-slate-100 bg-white p-5">

                                <div className="flex items-end gap-3 rounded-xl border border-slate-200 bg-slate-50 p-2.5 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-100">

                                    <textarea
                                        value={question}
                                        onChange={(e) => setQuestion(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        rows={1}
                                        placeholder="Ask your academic question..."
                                        disabled={sending}
                                        className="max-h-32 min-h-[42px] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
                                    />

                                    <button
                                        type="button"
                                        onClick={sendMessage}
                                        disabled={!question.trim() || sending}
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {sending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Send className="h-4 w-4" />
                                        )}
                                    </button>

                                </div>

                                <p className="mt-2 text-center text-[10px] text-slate-400">
                                    AI responses are generated from your SRMS academic data.
                                </p>

                            </div>

                        </section>

                    </div>

                </main>

            </div>

        </div>

    );

};

export default AIAssistant;