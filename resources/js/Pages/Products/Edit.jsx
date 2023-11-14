import Authenticated from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

const dateLocaleOpts = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}

export default function Edit({ auth, product, categories }) {
    const [ grossProfit, setGrossProfit ] = useState(((product.discounted_price - product.base_price) - ((0.7/100) * product.discounted_price )).toFixed(2));

    const { data, setData, post, errors, reset } = useForm({
        name: product.name,
        // sku: product.sku,
        cutoff_start: undefined,
        cutoff_end: undefined,
        description: product.description,
        category_id: product.category.id,
        selling_price: product.selling_price,
        discounted_price: product.discounted_price
    });

    function submit(e) {
        e.preventDefault();

        post(route('dashboard.products.edit', product.sku), {
            onSuccess: (e) => {
                // console.log(e)
                router.visit(route('dashboard.products'));
            },
            onError: (e) => {
                alert(e)
            }
        })
    }

    return (
        <Authenticated
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Product {product.sku}</h2>}
        >
            <Head title={`Edit ${product.sku}`} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-5">
                <div className="bg-white mt-5 rounded-md py-3">
                    <div className="px-3 py-3 flex flex-col gap-2 rounded-b-md">
                        <div className="grid grid-cols-2">
                            <div className="grid grid-rows-5">
                                <div className="grid grid-cols-2">
                                    <b>SKU</b>
                                    <span>{product.sku}</span>
                                </div>
                                <div className="grid grid-cols-2">
                                    <b>Name</b>
                                    <TextInput defaultValue={data.name} onChange={e=>setData('name', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2">
                                    <b>Status</b>
                                    {
                                        product.enabled ?
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
                                    <div>
                                        <TextInput type="time" defaultValue={product.cutoff_start} onChange={e=>setData('cutoff_start', e.target.value)} />
                                        <span className="mx-1">&rarr;</span>
                                        <TextInput type="time" defaultValue={product.cutoff_end} onChange={e=>setData('cutoff_end', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <b>Created at</b>
                                    <p>{new Date(product.created_at).toLocaleString('id', dateLocaleOpts)}</p>
                                </div>
                                <div className={`grid grid-cols-2 ${grossProfit < 0 ? "bg-rose-500 text-white px-3 rounded-md" : ""}`}>
                                    <b>Gross Profit (QRIS, 0.7%)</b>
                                    <span className="flex items-center gap-5">Rp{Intl.NumberFormat('id').format(grossProfit)} {grossProfit < 0 && product.enabled ? <b className="flex items-center gap-2 animate-pulse"><FaCircleExclamation /> PLEASE DISABLE</b> : ""}</span>
                                </div>
                            </div>

                            <div className="grid grid-rows-6">
                                <div className="grid grid-cols-2">
                                    <b>Desc</b>
                                    <TextInput defaultValue={data.description} />
                                </div>
                                <div className="grid grid-cols-2">
                                    <b>Category</b>
                                    <select onChange={e=>setData('category_id', e.target.value)}>
                                        <option value={data.category_id}>{product.category_id} - {product.category.name}</option>
                                        {
                                            categories.map((category, i) => {
                                                if(category.id !== product.category_id) return <option key={i} value={category.id}>{category.id} - {category.name}</option>
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="grid grid-cols-2">
                                    <b>Base Price</b>
                                    <div>
                                        <span className="mr-1">Rp</span>
                                        <span>{product.base_price}</span>
                                        <span className="ml-3">Ubah melalui {product.source}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <b>Selling Price</b>
                                    <div>
                                        <span className="mr-1">Rp</span>
                                        <TextInput type="number" min="1" defaultValue={data.selling_price} onChange={e=>setData('selling_price', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <b>Discounted Price</b>
                                    <div>
                                        <span className="mr-1">Rp</span>
                                        <TextInput type="number" min="1" defaultValue={data.discounted_price} onChange={e=>setData('discounted_price', e.target.value)} />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2">
                                    <b>Updated at</b>
                                    <p>{new Date(product.updated_at).toLocaleString('id', dateLocaleOpts)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <PrimaryButton onClick={submit}>Save</PrimaryButton>
                            <SecondaryButton onClick={_=>router.visit(route('dashboard.products'))}>Cancel</SecondaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}
