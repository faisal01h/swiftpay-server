import { Head } from "@inertiajs/react"
export default function Forbidden() {
    return (
        <div className="bg-gray-200 flex items-center justify-center h-screen select-none">
            <Head title="403 Forbidden" />
            <div className="flex flex-col items-center justify-center bg-rose-50 px-20 py-20 rounded-lg">
                <h1 className="font-bold text-2xl">Oops! You have encountered an error!</h1>
                <h2 className="font-extrabold text-7xl text-rose-600">403</h2>
                <p className="text-lg">Forbidden</p>
                <p>You are not allowed to access this section.</p>
            </div>
        </div>
    )
}
