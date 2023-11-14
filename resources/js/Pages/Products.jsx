import CategoryTableExpand from "@/Components/CategoryTableExpand";
import ProductTableExpand from "@/Components/ProductTableExpand";
import SecondaryButton from "@/Components/SecondaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import DataTable from "react-data-table-component";

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

    function filter() {
        router.visit(route('dashboard.products', {
            sku,
            name
        }))
    }

    console.log(categories)

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>}
        >
            <Head title="Products" />

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
                    <div className="px-5">
                        <h3 className="font-semibold text-xl text-gray-800 leading-tight">Categories</h3>
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
