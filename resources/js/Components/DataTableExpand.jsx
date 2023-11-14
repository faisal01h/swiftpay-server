import { router, useForm } from "@inertiajs/react";
import SecondaryButton from "./SecondaryButton";

const trxStatusClass = {
    UNPAID: "bg-gray-300 text-black",
    SUCCESS: "bg-green-600 text-white",
    PENDING: "bg-amber-600 text-white",
    FAILED: "bg-red-600 text-white",
    PEND_REFUND: "bg-gradient-to-r from-red-600 via-amber-600 to-orange-600 text-white animate-pulse",
    SUCC_REFUND: "bg-green-600 text-white",
    CANC_REFUND: "bg-red-600 text-white"
};

const statuses = [
    "UNPAID",
    "SUCCESS",
    "PENDING",
    "FAILED",
    "PEND_REFUND",
    "SUCC_REFUND",
    "CANC_REFUND"
]

export default function({ data, permissions }) {

    const { data: statusData, setData: setStatusData, post, errors } = useForm({
        ref_id: data.ref_id,
        status: null
    })

    function setStatus() {
        post(route('dashboard.transactions.status'), {
            onSuccess: (e) => {
                router.reload()
            },
            onError: (e) => {
                alert(e)
            }
        })
    }

    return (
        <div className="px-3 py-3 flex flex-col border rounded-b-md">
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
                        <b>Product</b>
                        <div className="flex flex-col">
                            <span className="bg-gray-300 px-1 rounded-md font-mono w-fit">{data.product.sku}</span>
                            <span className="text-xs">{data.product.name}</span>
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Payment Method</b>
                        <p>{data.payment_method}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Created at</b>
                        <p>{new Date(data.created_at).toLocaleString('id', {
                            timeStyle: 'medium',
                            dateStyle: 'medium',
                        })}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Price</b>
                        <div className="flex flex-col">
                            <div>
                                <span>Beli: Rp{Intl.NumberFormat('id').format(data.base_price)}</span>
                            </div>
                            <div>
                                <span>Jual: Rp{Intl.NumberFormat('id').format(data.selling_price)}</span>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Set status</b>
                        <div>
                            <select className="rounded-md py-1" onChange={e=>setStatusData('status', e.target.value)}>
                                <option>Select status</option>
                                {
                                    statuses.map((e, i) => {
                                        return <option key={i} value={e}>{e}</option>
                                    })
                                }
                            </select>
                            <SecondaryButton onClick={setStatus}>Set</SecondaryButton>
                        </div>
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
                        <b>Destination</b>
                        <p>{data.destination}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Source</b>
                        <p>{data.source}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Last update</b>
                        <p>{new Date(data.updated_at).toLocaleString('id', {
                            timeStyle: 'medium',
                            dateStyle: 'medium',
                        })}</p>
                    </div>
                    {
                        permissions.manual_transaction ?
                        <div className="grid grid-cols-2">
                            <b>Manual Transaction</b>
                            <div>

                            </div>
                        </div> : ""
                    }
                    {
                        permissions.manual_transaction ?
                        <div className="grid grid-cols-2">
                            <b>Refund</b>
                            <div>

                            </div>
                        </div> : ""
                    }
                </div>
            </div>
            <div className=" bg-gray-700 text-gray-200 rounded-lg gap-2 flex flex-col mt-3">
                <div className="py-1 px-3 bg-slate-800 rounded-t-lg">
                    <b className="">Activity Log</b>
                </div>
                <div className="break-all px-3 pb-2 font-mono">
                    {JSON.parse(data.raw_json).log.map((e, i) => {
                        return (
                            <ul key={i}>
                                <b>- {e.name} <span className="font-thin">({new Date(e.time).toLocaleString('id', {
                                        timeStyle: 'medium',
                                        dateStyle: 'medium',
                                    })})</span>
                                </b>
                                {
                                    e.data ?
                                    <div className="ml-5">
                                        {JSON.stringify(e.data)}
                                    </div> : ""
                                }
                            </ul>
                        )
                    })}
                </div>
            </div>
            {/* <div className=" bg-gray-700 text-gray-200 rounded-lg gap-2 flex flex-col mt-3">
                <div className="py-1 px-3 bg-slate-800 rounded-t-lg">
                    <b className="">Raw JSON</b>
                </div>
                <p className="break-all px-3 pb-2 font-mono">{JSON.stringify(data)}</p>
            </div> */}
        </div>
    )
}
