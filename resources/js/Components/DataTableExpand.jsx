const trxStatusClass = {
    UNPAID: "bg-slate-700, text-white",
    SUCCESS: "bg-green-600 text-white",
    PENDING: "bg-amber-600 text-white",
    FAILED: "bg-red-600 text-white",
    PEND_REFUND: "bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 text-white animate-pulse",
    SUCC_REFUND: "bg-green-600 text-white",
    CANC_REFUND: "bg-red-600 text-white"
};

export default function({ data }) {
    // console.log(data)

    return (
        <div className="px-3 py-3 flex flex-col">
            <div className={`${trxStatusClass[data.status]} rounded-full text-center`}>{data.status}</div>
            <div>

            </div>
            <div className="grid grid-cols-2">
                <div className="grid grid-rows-4">
                    <div className="grid grid-cols-2">
                        <b>User Identifier</b>
                        <p>{data.user_identifier}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Commodity</b>
                        <p>{data.commodity}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Payment Method</b>
                        <p>{data.payment_method}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Created at</b>
                        <p>{data.created_at}</p>
                    </div>
                </div>
                <div className="grid grid-rows-4">
                    <div className="grid grid-cols-2">
                        <b>Reference ID</b>
                        <p>{data.ref_id}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Invoice</b>
                        <p>{data.invoice}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Source</b>
                        <p>{data.source}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Last update</b>
                        <p>{data.updated_at}</p>
                    </div>
                </div>
            </div>
            <div className=" bg-gray-700 text-gray-200 rounded-lg gap-2 flex flex-col">
                <div className="py-1 px-3 bg-slate-800 rounded-t-lg">
                    <b className="">Raw JSON</b>
                </div>
                <p className="break-all px-3 pb-2 font-mono">{JSON.stringify(data)}</p>
            </div>
        </div>
    )
}
