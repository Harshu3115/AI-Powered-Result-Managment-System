import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { FaFilePdf, FaSave } from "react-icons/fa";

import AdminSidebar from "../../components/admin/AdminSidebar";
import AdminTopbar from "../../components/admin/AdminTopbar";


const API_URL = "/admin/college-pdf-settings";

const BACKEND_URL =
    "http://localhost:8080";

const CollegePdfSettings = () => {

    const [settings, setSettings] = useState({
        id: 1,
        societyName: "",
        collegeName: "",
        aboutLine1: "",
        aboutLine2: "",
        aboutLine3: "",
        accreditationText: "",
        academicYear: "",
        instituteCode: "",
        place: "",
        footerMotto: "",

        logoPath: "",
        stampPath: "",
        signaturePath: "",

        stampPosition: "CENTER",
        stampWidth: 100,
        stampHeight: 100,

        signaturePosition: "CENTER",
        signatureWidth: 130,
        signatureHeight: 80
    });

    const [logoFile, setLogoFile] = useState(null);
    const [stampFile, setStampFile] = useState(null);
    const [signatureFile, setSignatureFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // SIDEBAR TOGGLE STATES
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);



    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);

            const response = await api.get(
                "/admin/college-pdf-settings"
            );

            setSettings((previous) => ({
                ...previous,
                ...response.data
            }));
        } catch (err) {
            console.error("Settings load error:", err);

            setError(
                err.response?.data?.message ||
                "College PDF settings load failed."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleNumberChange = (event) => {
        const { name, value } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: value === "" ? "" : Number(value)
        }));
    };

    const uploadFile = async (file, type) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);

        const endpointMap = {
            logo: "/admin/college-pdf-settings/upload-logo",
            stamp: "/admin/college-pdf-settings/upload-stamp",
            signature: "/admin/college-pdf-settings/upload-signature",
        };

        const endpoint = endpointMap[type];

        if (!endpoint) {
            throw new Error(`Invalid upload type: ${type}`);
        }

        const response = await api.post(endpoint, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        return (
            response.data.logoPath ||
            response.data.stampPath ||
            response.data.signaturePath
        );
    };


    // हा code uploadFile च्या खाली ठेवा
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (loading) {
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setError("");

            const updatedSettings = {
                ...settings,
            };

            if (logoFile) {
                updatedSettings.logoPath = await uploadFile(logoFile, "logo");
            }

            if (stampFile) {
                updatedSettings.stampPath = await uploadFile(stampFile, "stamp");
            }

            if (signatureFile) {
                updatedSettings.signaturePath = await uploadFile(
                    signatureFile,
                    "signature"
                );
            }

            const response = await api.put(
                "/admin/college-pdf-settings",
                updatedSettings
            );

            setSettings(response.data);

            setLogoFile(null);
            setStampFile(null);
            setSignatureFile(null);

            setMessage("College PDF settings saved successfully.");
        } catch (err) {
            console.error("College PDF settings update error:", err);

            setError(
                err.response?.data?.message ||
                "College PDF settings update failed."
            );
        } finally {
            setLoading(false);
        }
    };



    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

    const labelClass =
        "mb-2 block text-sm font-semibold text-slate-600";

    const cardClass =
        "rounded-2xl border border-slate-200 bg-white p-6 shadow-sm";

    const fileInputClass =
        "w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-violet-100 file:px-4 file:py-2 file:font-semibold file:text-violet-700";

    return (
        <div className="min-h-screen bg-slate-100">

            {/* Existing Sidebar */}

            <AdminSidebar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
                onClose={() => setMobileOpen(false)}
            />

            <AdminTopbar
                collapsed={collapsed}
                setCollapsed={setCollapsed}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* Main Area */}

            <main
                className={`
                min-h-screen
                pt-[72px]
                transition-all
                duration-300

                ${collapsed
                        ? "md:ml-[76px]"
                        : "md:ml-[260px]"
                    }
            `}
            >




                {/* Page Content */}

                <section className="p-5 md:p-8">

                    {/* Page Heading */}

                    <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">

                        <div>
                            <h1 className="text-2xl font-bold text-slate-800 md:text-3xl">
                                College PDF Settings
                            </h1>

                            <p className="mt-2 text-sm text-slate-500">
                                Customize your college marksheet PDF.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">
                            <FaFilePdf />
                            PDF Configuration
                        </div>

                    </div>

                    {/* Messages */}

                    {message && (
                        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {error}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >

                        {/* College Details */}

                        <div className={cardClass}>

                            <div className="mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-lg font-bold text-slate-800">
                                    College Details
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Details displayed on the marksheet.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                                <div>
                                    <label className={labelClass}>
                                        Society Name
                                    </label>

                                    <input
                                        name="societyName"
                                        value={settings.societyName || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Enter society name"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        College Name
                                    </label>

                                    <input
                                        name="collegeName"
                                        value={settings.collegeName || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Enter college name"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Academic Year
                                    </label>

                                    <input
                                        name="academicYear"
                                        value={settings.academicYear || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="2026-2027"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Institute Code
                                    </label>

                                    <input
                                        name="instituteCode"
                                        value={settings.instituteCode || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Enter institute code"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Place
                                    </label>

                                    <input
                                        name="place"
                                        value={settings.place || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Pune"
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Footer Motto
                                    </label>

                                    <input
                                        name="footerMotto"
                                        value={settings.footerMotto || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Enter footer motto"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        About Line 1
                                    </label>

                                    <input
                                        name="aboutLine1"
                                        value={settings.aboutLine1 || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        About Line 2
                                    </label>

                                    <input
                                        name="aboutLine2"
                                        value={settings.aboutLine2 || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        About Line 3
                                    </label>

                                    <input
                                        name="aboutLine3"
                                        value={settings.aboutLine3 || ""}
                                        onChange={handleChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className={labelClass}>
                                        Accreditation Text
                                    </label>

                                    <textarea
                                        name="accreditationText"
                                        rows="4"
                                        value={
                                            settings.accreditationText || ""
                                        }
                                        onChange={handleChange}
                                        className={inputClass}
                                        placeholder="Enter complete accreditation text"
                                    />
                                </div>

                            </div>

                        </div>

                        {/* Logo */}

                        <div className={cardClass}>

                            <div className="mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-lg font-bold text-slate-800">
                                    College Logo
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Upload logo for the PDF header.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-2 md:items-center">

                                <div>
                                    <label className={labelClass}>
                                        Upload Logo
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={(event) =>
                                            setLogoFile(
                                                event.target.files[0]
                                            )
                                        }
                                        className={fileInputClass}
                                    />
                                </div>

                                {settings.logoPath && (
                                    <div>
                                        <p className={labelClass}>
                                            Current Logo
                                        </p>

                                        <img
                                            src={`${BACKEND_URL}${settings.logoPath}`}
                                            alt="College Logo"
                                            className="h-32 w-32 rounded-xl border border-slate-200 bg-white object-contain p-3"
                                        />
                                    </div>
                                )}

                            </div>

                        </div>

                        {/* Stamp */}

                        <div className={cardClass}>

                            <div className="mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-lg font-bold text-slate-800">
                                    College Stamp
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage stamp position and size.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                                <div className="md:col-span-3">
                                    <label className={labelClass}>
                                        Upload Stamp
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={(event) =>
                                            setStampFile(
                                                event.target.files[0]
                                            )
                                        }
                                        className={fileInputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Stamp Position
                                    </label>

                                    <select
                                        name="stampPosition"
                                        value={
                                            settings.stampPosition ||
                                            "CENTER"
                                        }
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="LEFT">
                                            Left
                                        </option>

                                        <option value="CENTER">
                                            Center
                                        </option>

                                        <option value="RIGHT">
                                            Right
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Stamp Width
                                    </label>

                                    <input
                                        type="number"
                                        name="stampWidth"
                                        value={settings.stampWidth || ""}
                                        onChange={handleNumberChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Stamp Height
                                    </label>

                                    <input
                                        type="number"
                                        name="stampHeight"
                                        value={settings.stampHeight || ""}
                                        onChange={handleNumberChange}
                                        className={inputClass}
                                    />
                                </div>

                            </div>

                            {settings.stampPath && (
                                <div className="mt-6">
                                    <p className={labelClass}>
                                        Current Stamp
                                    </p>

                                    <img
                                        src={`${BACKEND_URL}${settings.stampPath}`}
                                        alt="College Stamp"
                                        className="h-36 w-36 rounded-xl border border-slate-200 bg-white object-contain p-3"
                                    />
                                </div>
                            )}

                        </div>

                        {/* Signature */}

                        <div className={cardClass}>

                            <div className="mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-lg font-bold text-slate-800">
                                    Controller Signature
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage controller signature placement.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">

                                <div className="md:col-span-3">
                                    <label className={labelClass}>
                                        Upload Signature
                                    </label>

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg"
                                        onChange={(event) =>
                                            setSignatureFile(
                                                event.target.files[0]
                                            )
                                        }
                                        className={fileInputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Signature Position
                                    </label>

                                    <select
                                        name="signaturePosition"
                                        value={
                                            settings.signaturePosition ||
                                            "CENTER"
                                        }
                                        onChange={handleChange}
                                        className={inputClass}
                                    >
                                        <option value="LEFT">
                                            Left
                                        </option>

                                        <option value="CENTER">
                                            Center
                                        </option>

                                        <option value="RIGHT">
                                            Right
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Signature Width
                                    </label>

                                    <input
                                        type="number"
                                        name="signatureWidth"
                                        value={
                                            settings.signatureWidth || ""
                                        }
                                        onChange={handleNumberChange}
                                        className={inputClass}
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>
                                        Signature Height
                                    </label>

                                    <input
                                        type="number"
                                        name="signatureHeight"
                                        value={
                                            settings.signatureHeight || ""
                                        }
                                        onChange={handleNumberChange}
                                        className={inputClass}
                                    />
                                </div>

                            </div>

                            {settings.signaturePath && (
                                <div className="mt-6">
                                    <p className={labelClass}>
                                        Current Signature
                                    </p>

                                    <img
                                        src={`${BACKEND_URL}${settings.signaturePath}`}
                                        alt="Controller Signature"
                                        className="h-24 w-48 rounded-xl border border-slate-200 bg-white object-contain p-3"
                                    />
                                </div>
                            )}

                        </div>

                        {/* Save Button */}

                        <div className="flex justify-end">

                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FaSave />

                                {loading
                                    ? "Saving..."
                                    : "Save PDF Settings"}
                            </button>

                        </div>

                    </form>

                </section>

            </main>

        </div>
    );
};

export default CollegePdfSettings;