import CategoryTableExpand from "@/Components/CategoryTableExpand";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import ProductTableExpand from "@/Components/ProductTableExpand";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import DataTable from "react-data-table-component";
import { FaX } from "react-icons/fa6";

const columns = [
    {
        name: 'SKU',
        selector: row => <div><pre className='font-mono font-semibold tracking-wider hover:bg-gray-300 px-1 cursor-copy' onClick={e=>navigator.clipboard.writeText(row.sku)}>{row.sku}</pre></div>,
    },
    {
        name: 'Name',
        selector: row => row.name,
        sortable: true
    },
    {
        name: 'Category',
        selector: row => row.category.name,
    },
    {
        name: 'Base Price',
        selector: row => 'Rp'+Intl.NumberFormat('id').format(row.base_price),
    },
    {
        name: <div>Selling Price / <b>Discounted Price</b></div>,
        selector: row => <div>{'Rp'+Intl.NumberFormat('id').format(row.selling_price)} / <b>{'Rp'+Intl.NumberFormat('id').format(row.discounted_price)}</b></div>,
    },
    {
        name: 'Active',
        selector: row => row.enabled ? <div className="w-4 h-4 rounded-full bg-emerald-500"></div> : <div className="w-4 h-4 rounded-full bg-rose-500"></div>,
    },
    {
        name: 'Cutoff',
        selector: row => row.cutoff_start+' - '+row.cutoff_end,
    },
]

const categoryColumns = [
    {
        name: 'Name',
        selector: row => row.name
    },
    {
        name: 'Slug',
        selector: row => <Link href={`https://belibakol.com/products/${row.slug}`}>{row.slug}</Link>
    },
    {
        name: 'Prompt',
        selector: row => row.prompt
    },
    {
        name: 'Image',
        selector: row => row.image ? <img src={'/storage/'+row.image} width={50} /> : "None"
    },
    {
        name: 'Cover Image',
        selector: row => row.cover_image ? <img src={'/storage/'+row.cover_image} width={50} /> : "None"
    }

]

export default function Products({ auth, products, categories }) {
    const [ tableDataLoading, setTableDataLoading ] = useState(false);
    const [ sku, setSku ] = useState();
    const [ name, setName ] = useState();
    const [ showAddCatModal, setShowAddCatModal ] = useState(false);

    const { data: catData, setData: setCatData, post: postCat, errors: errorsCat } = useForm({
        name: null,
        slug: null,
        prompt: null
    })

    function filter() {
        router.visit(route('dashboard.products', {
            sku,
            name
        }))
    }

    function closeCatModal() {
        setShowAddCatModal(false);
    }

    function addCategory() {
        postCat(route('dashboard.categories'), {
            onSuccess: (_e) => {
                router.reload()
                closeCatModal()
            },
            onError: (e) => {
                console.error(e)
            }
        })
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

            <Modal show={showAddCatModal} onClose={closeCatModal}>
                <div className="px-5 py-3 flex flex-col gap-5">
                    <div className="border-b pb-2 flex justify-between items-center">
                        <h3 className="text-lg font-bold">Add Category</h3>
                        <button onClick={closeCatModal}>
                            <FaX />
                        </button>
                    </div>
                    <div className="flex flex-col gap-3">
                        <div className="grid sm:grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
                            <InputLabel htmlFor="sp_cat_name">Category Name</InputLabel>
                            <TextInput id="sp_cat_name" autoComplete="false" name="sp_cat_name" onChange={e=>setCatData('name', e.target.value)} />
                        </div>
                        <div className="grid sm:grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
                            <InputLabel htmlFor="slug">Slug</InputLabel>
                            <TextInput id="slug" onChange={e=>setCatData('slug', e.target.value)} />
                        </div>
                        <div className="grid sm:grid-rows-2 lg:grid-rows-1 lg:grid-cols-2">
                            <InputLabel htmlFor="prompt">Prompt</InputLabel>
                            <TextInput id="prompt" onChange={e=>setCatData('prompt', e.target.value)} />
                        </div>
                    </div>
                    <div className="border-t pt-2 flex justify-end">
                        <PrimaryButton onClick={addCategory}>Save</PrimaryButton>
                    </div>
                </div>
            </Modal>

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-5">

                <div className="bg-white mt-5 rounded-md py-3">
                    <div className="flex mx-3 gap-3 my-1 items-center">
                        <div>
                            <TextInput placeholder="sku" onChange={e=>setSku(e.target.value)} />
                        </div>
                        <div>
                            <TextInput placeholder="name" onChange={e=>setName(e.target.value)} />
                        </div>
                        <div>
                            <SecondaryButton onClick={filter}>Filter</SecondaryButton>
                        </div>
                    </div>
                    <DataTable
                        columns={columns}
                        data={products}
                        expandableRows
                        pagination
                        paginationPerPage={20}
                        fixedHeader
                        progressPending={tableDataLoading}
                        dense
                        highlightOnHover
                        expandableRowsComponent={ProductTableExpand}
                        // expandableRowsComponentProps={{"permissions": permissions}}
                    />
                </div>

                <div className="bg-white rounded-md py-3">
                    <div className="px-5 flex justify-between py-1">
                        <h3 className="font-semibold text-xl text-gray-800 leading-tight">Categories</h3>
                        <SecondaryButton onClick={_=>setShowAddCatModal(true)}>Add</SecondaryButton>
                    </div>
                    <div>
                        <DataTable
                            columns={categoryColumns}
                            data={categories}
                            expandableRows
                            pagination
                            fixedHeader
                            highlightOnHover
                            expandableRowsComponent={CategoryTableExpand}
                        />
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    )
}
