export default function RoleBadge({ className = '', role, children, hoverEnlarge=false, skew=true, ...props }) {
    let baseClass = {
        /*
        *   C-Level         : Gradient background according to their respective department
        *   Senior Position : Solid background according to their respective department
        *   Junior Position : Colored border according to their respective department
        */
        CEO: "bg-gradient-to-r from-yellow-700 to-amber-400 text-gray-100",
        CFO: "bg-gradient-to-r from-emerald-600 to-green-400 text-gray-100",
        CTO: "bg-gradient-to-r from-blue-700 to-cyan-400 text-gray-100",
        COO: "bg-gradient-to-r from-rose-600 to-pink-400 text-gray-100",
        Accounting: "border border-emerald-500 text-emerald-500",
        "Customer Relations": "border border-rose-500 text-rose-500",
        "Operations": "border border-rose-500 text-rose-500",
        "Senior Software Engineer": "bg-cyan-600 text-gray-100",
        "3-Years of Service": "bg-gradient-to-r from-[#C4540B] via-amber-500 to-[#967100] text-white",
        "5-Years of Service": "bg-gradient-to-r from-gray-600 via-slate-300 to-slate-800 text-white",
        "10-Years of Service": "bg-gradient-to-r from-amber-600 via-amber-300 to-orange-600 text-white",
    };
    return (
        <div
            {...props}
            className={`px-2 py-1 flex justify-center items-center w-fit h-fit transition-all duration-300 ${skew?"-skew-x-12":""} text-xs font-bold rounded-md cursor-default ${hoverEnlarge ? "hover:text-lg":""} ${baseClass[role]} ${className}`}
        >
            {children}
        </div>
    );
}
