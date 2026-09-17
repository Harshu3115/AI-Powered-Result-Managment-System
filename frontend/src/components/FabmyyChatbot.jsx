import { useState, useRef, useEffect } from "react";

import {
    X,
    Send,
    Bot,
    Trash2,
    Minimize2,
    MessageCircle,
    Sparkles,
} from "lucide-react";

import fabmyyService from "../services/fabmyyService";

function Fabmyy() {

    // =====================================================
    // STATE
    // =====================================================

    const [isOpen, setIsOpen] = useState(false);

    const [showWelcome, setShowWelcome] = useState(true);

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        {
            id: 1,
            type: "ai",
            text: "Hi! 👋 I'm Fabmyy. How can I help you today?",
        },
    ]);

    const messagesEndRef = useRef(null);

    // =====================================================
    // AUTO SCROLL
    // =====================================================

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages, loading]);

    // =====================================================
    // OPEN CHAT
    // =====================================================

    const openChat = () => {
        setShowWelcome(false);
        setIsOpen(true);
    };

    // =====================================================
    // CLOSE CHAT
    // =====================================================

    const closeChat = () => {
        setIsOpen(false);
    };

    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = async () => {

        const question = message.trim();

        if (!question || loading) {
            return;
        }

        // -------------------------------------------------
        // USER MESSAGE
        // -------------------------------------------------

        const userMessage = {
            id: Date.now(),
            type: "user",
            text: question,
        };

        setMessages((prev) => [
            ...prev,
            userMessage,
        ]);

        setMessage("");

        setLoading(true);

        try {

            // -------------------------------------------------
            // CALL BACKEND
            // -------------------------------------------------

            const response =
                await fabmyyService.chat(question);

            console.log(
                "Fabmyy Response:",
                response
            );

            const answer =
                response?.data?.answer ||
                "Sorry, I could not generate a response.";

            // -------------------------------------------------
            // AI MESSAGE
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
                "Fabmyy Error:",
                error
            );

            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    type: "ai",
                    text:
                        "Sorry 😔 Something went wrong. Please try again.",
                },
            ]);

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleKeyDown = (e) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();
        }
    };

    // =====================================================
    // CLEAR CHAT
    // =====================================================

    const clearChat = () => {

        setMessages([
            {
                id: Date.now(),
                type: "ai",
                text:
                    "Hi! 👋 I'm Fabmyy. How can I help you today?",
            },
        ]);
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <>
            {/* =================================================
                WELCOME NOTIFICATION
            ================================================= */}

            {!isOpen && showWelcome && (

                <div
                    className="
                        fixed
                        right-7
                        bottom-28
                        z-[9998]
                        w-[390px]
                        max-w-[calc(100vw-32px)]
                        animate-[fabmyyPopup_0.4s_ease-out]
                    "
                >

                    <div
                        onClick={openChat}
                        className="
                            relative
                            cursor-pointer
                            rounded-[15px]
                            bg-white

                            border-slate-200
                            shadow-[0_15px_45px_rgba(15,23,42,0.18)]
                            px-5
                            py-4
                            transition-all
                            duration-200
                            hover:-translate-y-1
                            hover:shadow-[0_20px_55px_rgba(15,23,42,0.22)]
                        "
                    >

                        {/* -----------------------------------------
                            CLOSE NOTIFICATION
                        ----------------------------------------- */}

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowWelcome(false);
                            }}
                            className="
                                absolute
                                right-3
                                top-3
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-full
                                text-slate-400
                                hover:bg-slate-100
                                hover:text-slate-700
                                transition
                            "
                        >
                            <X size={17} />
                        </button>

                        <div className="flex items-start gap-4">

                            {/* -----------------------------------------
                                FABMYY ICON
                            ----------------------------------------- */}

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-slate-950
                                    text-white
                                    shadow-lg
                                "
                            >
                                <Bot size={26} />
                            </div>

                            {/* -----------------------------------------
                                TEXT
                            ----------------------------------------- */}

                            <div className="pr-5">

                                <p
                                    className="
                                        text-[14px]
                                        leading-6
                                        text-slate-800
                                    "
                                >
                                    Hi! I am{" "}
                                    <span className="font-semibold">
                                        Fabmyy
                                    </span>
                                    !
                                    <br />

                                    Your AI assistant for
                                    your build journey.
                                    <br />

                                    <span className="font-semibold">
                                        Chat with me for FREE!
                                    </span>
                                </p>

                                <p
                                    className="
                                        mt-2
                                        text-sm
                                        text-slate-500
                                    "
                                >
                                    Fabmyy AI • Just now
                                </p>

                            </div>

                        </div>

                    </div>

                    {/* -----------------------------------------
                        SMALL POINTER
                    ----------------------------------------- */}

                    <div
                        className="
                            absolute
                            right-10
                            -bottom-2
                            h-5
                            w-5
                            rotate-45
                            bg-white
                            border-r
                            border-b
                            border-slate-200
                        "
                    />

                </div>
            )}


            {/* =================================================
                FLOATING FABMYY BUTTON
            ================================================= */}

            {!isOpen && (

                <button
                    onClick={openChat}
                    aria-label="Open Fabmyy"
                    className="
                        fixed
                        right-7
                        bottom-7
                        z-[9999]
                        flex
                        h-[52px]
                        w-[52px]
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-950
                        text-white
                        shadow-[0_12px_35px_rgba(15,23,42,0.30)]
                        transition-all
                        duration-200
                        hover:scale-105
                        hover:shadow-[0_18px_45px_rgba(15,23,42,0.38)]
                    "
                >

                    <Bot
                        size={35}
                        strokeWidth={2.2}
                    />

                    {/* -----------------------------------------
                        UNREAD BADGE
                    ----------------------------------------- */}

                    {showWelcome && (

                        <span
                            className="
                                absolute
                                -right-1
                                -top-1
                                flex
                                h-6
                                min-w-6
                                items-center
                                justify-center
                                rounded-full
                                border-2
                                border-white
                                bg-red-500
                                px-1
                                text-xs
                                font-bold
                                text-white
                            "
                        >
                            1
                        </span>

                    )}

                </button>
            )}


            {/* =================================================
                CHAT WINDOW
            ================================================= */}

            {isOpen && (

                <div
                    className="
                        fixed
                        right-7
                        bottom-7
                        z-[9999]
                        flex
                        h-[600px]
                        w-[400px]
                        max-w-[calc(100vw-24px)]
                        flex-col
                        overflow-hidden
                        rounded-[20px]
                        border
                        border-slate-200
                        bg-white
                        shadow-[0_25px_80px_rgba(15,23,42,0.25)]
                        animate-[fabmyyChat_0.3s_ease-out]
                    "
                >

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div
                        className="
                            flex
                            min-h-[76px]
                            items-center
                            justify-between
                            bg-slate-950
                            px-5
                            text-white
                        "
                    >

                        <div className="flex items-center gap-3">

                            {/* BOT ICON */}

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-white
                                    text-slate-950
                                "
                            >
                                <Bot size={25} />
                            </div>

                            <div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <h3
                                        className="
                                            text-lg
                                            font-bold
                                        "
                                    >
                                        Fabmyy
                                    </h3>

                                    <Sparkles
                                        size={15}
                                        className="text-yellow-300 animate-[spin_5s_linear_infinite]"
                                    />

                                </div>

                                <div
                                    className="
                                        mt-0.5
                                        flex
                                        items-center
                                        gap-1.5
                                        text-xs
                                        text-slate-300
                                    "
                                >

                                    <span
                                        className="
                                            h-2
                                            w-2
                                            rounded-full
                                            bg-green-400
                                        "
                                    />

                                    AI Assistant

                                </div>

                            </div>

                        </div>


                        {/* HEADER BUTTONS */}

                        <div className="flex items-center gap-1">

                            <button
                                onClick={clearChat}
                                title="Clear chat"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-300
                                    transition
                                    hover:bg-white/10
                                    hover:text-white
                                "
                            >
                                <Trash2 size={17} />
                            </button>

                            <button
                                onClick={closeChat}
                                title="Minimize"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-300
                                    transition
                                    hover:bg-white/10
                                    hover:text-white
                                "
                            >
                                <Minimize2 size={18} />
                            </button>

                            <button
                                onClick={closeChat}
                                title="Close"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-lg
                                    text-slate-300
                                    transition
                                    hover:bg-white/10
                                    hover:text-white
                                "
                            >
                                <X size={20} />
                            </button>

                        </div>

                    </div>


                    {/* =================================================
                        CHAT MESSAGES
                    ================================================= */}

                    <div
                        className="
                            flex-1
                            overflow-y-auto
                            bg-slate-50
                            px-4
                            py-5
                        "
                    >

                        {messages.map((msg) => (

                            <div
                                key={msg.id}
                                className={`
                                    mb-4
                                    flex
                                    ${msg.type === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                    }
                                `}
                            >

                                {/* AI ICON */}

                                {msg.type === "ai" && (

                                    <div
                                        className="
                                            mr-2
                                            mt-1
                                            flex
                                            h-8
                                            w-8
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-slate-950
                                            text-white
                                        "
                                    >
                                        <Bot size={16} />
                                    </div>

                                )}


                                {/* MESSAGE */}

                                <div
                                    className={`
                                        max-w-[78%]
                                        whitespace-pre-wrap
                                        break-words
                                        rounded-2xl
                                        px-4
                                        py-3
                                        text-sm
                                        leading-6
                                        ${msg.type === "user"
                                            ? `
                                                    rounded-br-md
                                                    bg-slate-950
                                                    text-white
                                                    shadow-sm
                                                  `
                                            : `
                                                    rounded-tl-md
                                                    border
                                                    border-slate-200
                                                    bg-white
                                                    text-slate-700
                                                    shadow-sm
                                                  `
                                        }
                                    `}
                                >
                                    {msg.text}
                                </div>

                            </div>

                        ))}


                        {/* =================================================
                            TYPING INDICATOR
                        ================================================= */}

                        {loading && (

                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                "
                            >

                                <div
                                    className="
                                        mr-2
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-slate-950
                                        text-white
                                    "
                                >
                                    <Bot size={16} />
                                </div>

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-1
                                        rounded-2xl
                                        rounded-tl-md
                                        border
                                        border-slate-200
                                        bg-white
                                        px-4
                                        py-4
                                    "
                                >

                                    <span
                                        className="
                                            h-2
                                            w-2
                                            animate-bounce
                                            rounded-full
                                            bg-slate-500
                                        "
                                    />

                                    <span
                                        className="
                                            h-2
                                            w-2
                                            animate-bounce
                                            rounded-full
                                            bg-slate-500
                                            [animation-delay:150ms]
                                        "
                                    />

                                    <span
                                        className="
                                            h-2
                                            w-2
                                            animate-bounce
                                            rounded-full
                                            bg-slate-500
                                            [animation-delay:300ms]
                                        "
                                    />

                                </div>

                            </div>

                        )}

                        <div ref={messagesEndRef} />

                    </div>


                    {/* =================================================
                        INPUT
                    ================================================= */}

                    <div
                        className="
                            border-t
                            border-slate-200
                            bg-white
                            px-3
                            py-3
                        "
                    >

                        <div
                            className="
                                flex
                                items-end
                                gap-2
                            "
                        >

                            <textarea
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Ask Fabmyy anything..."
                                rows={1}
                                disabled={loading}
                                className="
                                    max-h-28
                                    min-h-[44px]
                                    flex-1
                                    resize-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    bg-slate-50
                                    px-3
                                    py-3
                                    text-sm
                                    text-slate-800
                                    outline-none
                                    transition
                                    placeholder:text-slate-400
                                    focus:border-slate-400
                                    focus:bg-white
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            />

                            <button
                                onClick={sendMessage}
                                disabled={
                                    !message.trim() ||
                                    loading
                                }
                                className="
                                    flex
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-slate-950
                                    text-white
                                    transition
                                    hover:bg-slate-800
                                    disabled:cursor-not-allowed
                                    disabled:opacity-40
                                "
                            >
                                <Send size={18} />
                            </button>

                        </div>

                        <p
                            className="
                                mt-2
                                text-center
                                text-[10px]
                                text-slate-400
                            "
                        >
                            Fabmyy AI • Ask anything
                        </p>

                    </div>

                </div>
            )}


            {/* =================================================
                ANIMATIONS
            ================================================= */}

            <style>
                {`
                    @keyframes fabmyyPopup {
                        from {
                            opacity: 0;
                            transform: translateY(15px) scale(0.96);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }

                    @keyframes fabmyyChat {
                        from {
                            opacity: 0;
                            transform: translateY(20px) scale(0.96);
                        }

                        to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                        }
                    }
                `}
            </style>
        </>
    );
}

export default Fabmyy;