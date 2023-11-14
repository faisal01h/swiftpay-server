import { useState } from "react"
import DangerButton from "./DangerButton"
import PrimaryButton from "./PrimaryButton"
import SecondaryButton from "./SecondaryButton"
import { FaCircleExclamation, FaExclamation, FaStop } from "react-icons/fa6"
import axios from "axios"
import { Link, router } from "@inertiajs/react"

const dateLocaleOpts = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}

export default function ProductTableExpand({ data }) {
    const [ grossProfit, setGrossProfit ] = useState(((data.discounted_price - data.base_price) - ((0.7/100) * data.discounted_price )).toFixed(2));

    function disable() {
        axios.post(route('wapi.product.togglestatus'), {
            command: 'disable',
            sku: data.sku
        })
        .then((e) => {
            console.log(e.data)
            router.reload()
        })
        .catch(console.error)
    }

    function enable() {
        axios.post(route('wapi.product.togglestatus'), {
            command: 'enable',
            sku: data.sku
        })
        .then((e) => {
            console.log(e.data)
            router.reload()
        })
        .catch(console.error)
    }

    return (
        <div className="px-3 py-3 flex flex-col gap-2 border rounded-b-md">
            <div className="grid grid-cols-2">
                <div className="grid grid-rows-5">
                    <div className="grid grid-cols-2">
                        <b>SKU</b>
                        <p>{data.sku}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Name</b>
                        <p className="text-xs">{data.name}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Status</b>
                        {
                            data.enabled ?
                            <div className="flex items-center gap-2 text-emerald-800">
                                <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse duration-700 transition-all"></div>
                                Enabled
                            </div>
                            :
                            <div className="flex items-center gap-2 text-rose-800">
                                <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
                                Disabled
                            </div>
                        }
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Cutoff</b>
                        <p>{data.cutoff_start} - {data.cutoff_end}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Created at</b>
                        <p>{new Date(data.created_at).toLocaleString('id', dateLocaleOpts)}</p>
                    </div>
                    <div className={`grid grid-cols-2 ${grossProfit < 0 ? "bg-rose-500 text-white px-3 rounded-md" : ""}`}>
                        <b>Gross Profit (QRIS, 0.7%)</b>
                        <span className="flex items-center gap-5">Rp{Intl.NumberFormat('id').format(grossProfit)} {grossProfit < 0 && data.enabled ? <b className="flex items-center gap-2 animate-pulse"><FaCircleExclamation /> PLEASE DISABLE</b> : ""}</span>
                    </div>
                </div>

                <div className="grid grid-rows-6">
                    <div className="grid grid-cols-2">
                        <b>Desc</b>
                        <p className="text-xs">{data.description}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Category</b>
                        <p>#{data.category_id} - {data.category.name}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Base Price</b>
                        <p>Rp{Intl.NumberFormat('id').format(data.base_price)}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Selling Price</b>
                        <p>Rp{Intl.NumberFormat('id').format(data.selling_price)}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Discounted Price</b>
                        <b>Rp{Intl.NumberFormat('id').format(data.discounted_price)}</b>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Updated at</b>
                        <p>{new Date(data.updated_at).toLocaleString('id', dateLocaleOpts)}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <Link href={route('dashboard.products.edit', data.sku)}>
                    <SecondaryButton>Edit</SecondaryButton>
                </Link>
                {
                    data.enabled ?
                    <DangerButton onClick={disable}>Disable</DangerButton>
                    :
                    <PrimaryButton onClick={enable}>Enable</PrimaryButton>
                }
            </div>
        </div>
    )
}
