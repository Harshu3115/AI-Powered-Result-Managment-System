import { useEffect, useState } from "react";
import { X, Building2 } from "lucide-react";

function DepartmentFormModal({
    editingDepartment,
    onSubmit,
    onClose,
    saving,
}) {

    const [formData, setFormData] = useState({
        departmentCode: "",
        departmentName: "",
        description: "",
    });

    const [errors, setErrors] = useState({});


    // =====================================================
    // LOAD EDIT DATA
    // =====================================================

    useEffect(() => {

        if (editingDepartment) {

            setFormData({
                departmentCode:
                    editingDepartment.departmentCode || "",

                departmentName:
                    editingDepartment.departmentName || "",

                description:
                    editingDepartment.description || "",
            });

        } else {

            setFormData({
                departmentCode: "",
                departmentName: "",
                description: "",
            });
        }

        setErrors({});

    }, [editingDepartment]);


    // =====================================================
    // INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };


    // =====================================================
    // VALIDATION
    // =====================================================

    const validate = () => {

        const newErrors = {};

        if (!formData.departmentCode.trim()) {
            newErrors.departmentCode =
                "Department code is required.";
        }

        if (!formData.departmentName.trim()) {
            newErrors.departmentName =
                "Department name is required.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) {
            return;
        }

        await onSubmit({
            departmentCode:
                formData.departmentCode.trim(),

            departmentName:
                formData.departmentName.trim(),

            description:
                formData.description.trim(),
        });
    };


    return (
        <div
            className="
                fixed
                inset-0
                z-[150]
                flex
                items-center
                justify-center
                bg-slate-900/40
                backdrop-blur-sm
                p-4
            "
            onMouseDown={(e) => {

                if (e.target === e.currentTarget && !saving) {
                    onClose();
                }

            }}
        >

            <div
                className="
                    w-full
                    max-w-lg
                    overflow-hidden
                    rounded-2xl
                    bg-white
                    shadow-2xl
                "
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        border-b
                        border-slate-200
                        px-6
                        py-5
                    "
                >

                    <div className="flex items-center gap-3">

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-indigo-50
                                text-indigo-600
                            "
                        >
                            <Building2 size={20} />
                        </div>

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {editingDepartment
                                    ? "Edit Department"
                                    : "Add Department"}
                            </h2>

                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                {editingDepartment
                                    ? "Update department details"
                                    : "Create a new department"}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            text-slate-400
                            hover:bg-slate-100
                            hover:text-slate-700
                            disabled:opacity-50
                        "
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* ================================================= */}
                {/* FORM */}
                {/* ================================================= */}

                <form onSubmit={handleSubmit}>

                    <div className="space-y-5 px-6 py-6">

                        {/* DEPARTMENT CODE */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                "
                            >
                                Department Code
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="departmentCode"
                                value={formData.departmentCode}
                                onChange={handleChange}
                                placeholder="e.g. CSE"
                                disabled={saving}
                                className={`
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    transition
                                    ${errors.departmentCode
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    }
                                `}
                            />

                            {errors.departmentCode && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.departmentCode}
                                </p>
                            )}

                        </div>


                        {/* DEPARTMENT NAME */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                "
                            >
                                Department Name
                                <span className="ml-1 text-red-500">
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="departmentName"
                                value={formData.departmentName}
                                onChange={handleChange}
                                placeholder="e.g. Computer Science & Engineering"
                                disabled={saving}
                                className={`
                                    w-full
                                    rounded-xl
                                    border
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    transition
                                    ${errors.departmentName
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    }
                                `}
                            />

                            {errors.departmentName && (
                                <p className="mt-1 text-xs text-red-500">
                                    {errors.departmentName}
                                </p>
                            )}

                        </div>


                        {/* DESCRIPTION */}

                        <div>

                            <label
                                className="
                                    mb-1.5
                                    block
                                    text-sm
                                    font-medium
                                    text-slate-700
                                "
                            >
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Enter department description..."
                                rows={4}
                                disabled={saving}
                                className="
                                    w-full
                                    resize-none
                                    rounded-xl
                                    border
                                    border-slate-200
                                    px-4
                                    py-2.5
                                    text-sm
                                    text-slate-700
                                    outline-none
                                    transition
                                    focus:border-indigo-500
                                    focus:ring-2
                                    focus:ring-indigo-100
                                "
                            />

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* FOOTER */}
                    {/* ================================================= */}

                    <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-3
                            border-t
                            border-slate-100
                            bg-slate-50
                            px-6
                            py-4
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={saving}
                            className="
                                rounded-xl
                                border
                                border-slate-200
                                bg-white
                                px-5
                                py-2.5
                                text-sm
                                font-medium
                                text-slate-600
                                transition
                                hover:bg-slate-100
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={saving}
                            className="
                                flex
                                min-w-[120px]
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-indigo-600
                                px-5
                                py-2.5
                                text-sm
                                font-semibold
                                text-white
                                transition
                                hover:bg-indigo-700
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {saving ? (
                                <>
                                    <span
                                        className="
                                            h-4
                                            w-4
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-white/40
                                            border-t-white
                                        "
                                    />

                                    Saving...
                                </>
                            ) : (
                                editingDepartment
                                    ? "Update Department"
                                    : "Add Department"
                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
}

export default DepartmentFormModal;