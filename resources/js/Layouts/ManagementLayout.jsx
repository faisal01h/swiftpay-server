import { Link } from "@inertiajs/react";
import Authenticated from "./AuthenticatedLayout";
export default function ManagementLayout({auth, children}) {

    const sidebarLinks = [
        {
            title: "Employees",
            route: "dashboard.management"
        },
        {
            title: "Financial Report",
            route: "dashboard"
        }
    ]

    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Management</h2>}
        >

            <div className="py-12">


                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-row gap-5">
                    <div className="flex flex-col gap-2 md:w-48">
                        <div className="bg-white h-32 rounded-md px-3 py-2 flex flex-col items-center justify-center ring-1 hover:scale-105 hover:shadow-lg hover:shadow-indigo-400 select-none transition-all">
                            <h3 className="font-bold text-black">Halo, {auth.user.name.split(" ")[0]}!</h3>
                            <p className="text-center">Tidak ada laporan untuk saat ini 😉</p>
                        </div>
                    {
                        sidebarLinks.map((e, i) => {
                            return <Link key={i} href={route(e.route)} className={`${route().current(e.route) ? "bg-indigo-600 text-white hover:bg-indigo-700" : "text-indigo-600 hover:ring-1"} rounded-md px-3 py-1 hover:scale-105 transition-all`}>
                                {e.title}
                            </Link>
                        })
                    }
                    </div>
                    { children }
                </div>
                <div className="px-2 bg-gray-800 text-gray-200 rounded w-fit flex flex-col text-xs font-thin font-mono fixed bottom-2 left-2">
                    <span>swift-secure-cnet-build-231021.001</span>
                    <span>Secure CorporateNet v1.0 Dev Build</span>
                </div>
            </div>

        </Authenticated>
    );
}
