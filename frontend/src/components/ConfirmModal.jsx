import React from "react";
import {
    AlertTriangle,
    X,
    Loader2,
} from "lucide-react";

const ConfirmModal = ({
    open,
    title = "Confirm Action",
    message = "Are you sure you want to continue?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    loading = false,
    variant = "danger",
    children,
}) => {

    if (!open) {
        return null;
    }

    const isDanger = variant === "danger";

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget && !loading) {
                    onCancel();
                }
            }}
        >

            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">

                {/* HEADER */}

                <div className="flex items-start justify-between border-b border-slate-100 px-6 py-5">

                    <div className="flex items-center gap-3">

                        <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${isDanger
                                ? "bg-red-50"
                                : "bg-indigo-50"
                                }`}
                        >
                            <AlertTriangle
                                className={`h-5 w-5 ${isDanger
                                    ? "text-red-500"
                                    : "text-indigo-600"
                                    }`}
                            />
                        </div>

                        <div>

                            <h3 className="text-lg font-bold text-slate-800">
                                {title}
                            </h3>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Please confirm your action
                            </p>

                        </div>

                    </div>


                    {/* CLOSE */}

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onCancel}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>

                </div>


                {/* BODY */}

                <div className="px-6 py-5">

                    <p className="text-sm leading-6 text-slate-600">
                        {message}
                    </p>


                    {/* OPTIONAL CUSTOM CONTENT */}

                    {children && (
                        <div className="mt-4">
                            {children}
                        </div>
                    )}

                </div>


                {/* FOOTER */}

                <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">

                    <button
                        type="button"
                        disabled={loading}
                        onClick={onCancel}
                        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {cancelText}
                    </button>


                    <button
                        type="button"
                        disabled={loading}
                        onClick={onConfirm}
                        className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${isDanger
                            ? "bg-red-600 hover:bg-red-700"
                            : "bg-indigo-600 hover:bg-indigo-700"
                            }`}
                    >

                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            confirmText
                        )}

                    </button>

                </div>

            </div>

        </div>
    );
};

export default ConfirmModal;