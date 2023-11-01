import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, useRemember } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import DataTable from 'react-data-table-component';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Dropdown from '@/Components/Dropdown';
import SecondaryButton from '@/Components/SecondaryButton';
import DataTableExpand from '@/Components/DataTableExpand';

const transactionStatuses = ["SUCCESS", "PENDING", "UNPAID", "FAILED", "PEND_REFUND", "SUCC_REFUND", "CNCL_REFUND"]

function beep() {
    var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
    snd.play();
}

const columns = [
    {
        name: 'Invoice',
        selector: row => <div><pre className='font-mono font-semibold tracking-wider hover:bg-gray-300 px-1 cursor-copy' onClick={e=>navigator.clipboard.writeText(row.invoice)}>{row.invoice}</pre></div>,
    },
    {
        name: 'RefID',
        selector: row => <div><pre className='font-mono font-semibold hover:bg-gray-300 px-1 cursor-copy' onClick={e=>navigator.clipboard.writeText(row.ref_id)}>{row.ref_id}</pre></div>,
    },
    {
        name: 'User ID',
        selector: row => row.user_identifier,
        sortable: true,
    },
    {
        name: 'Status',
        selector: row => row.status,
    },
    {
        name: 'SKU',
        selector: row => row.product.sku,
        sortable: true,
    },
    {
        name: 'Sold Price',
        selector: row => Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(row.selling_price),
        sortable: true,
    },
];

export default function Dashboard({ auth, stats, filteredData, permissions }) {

    const [ autofetch, setAutofetch ] = useState(true);
    const [ prevRefundPendingValue, setPrevRefundPendingValue ] = useState(-1);
    const [ refundPendingValue, setRefundPendingValue ] = useState(-1);
    const [ refundPendingAlert, setRefundPendingAlert ] = useRemember(false);
    const [ tableDataLoading, setTableDataLoading ] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        invoice: null,
        ref_id: null,
        user_identifier: null,
        status: null
    });

    function transactionCount(status) {
        return stats.transactions[status];
    }

    const reloadData = () => {
        if(autofetch) router.reload({ only: ['stats', 'filteredData'] })
        // console.log(stats)
    }

    function submitSearch(e) {
        e.preventDefault();
        sendRequest()
    }

    useEffect(() => {
        const interval = setInterval(() => {
            reloadData();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    function sendRequest() {
        setTableDataLoading(true)
        router.visit(
            `${route('dashboard.transactions')}?invoice=${data.invoice?data.invoice:""}&ref_id=${data.ref_id?data.ref_id:""}&user_identifier=${data.user_identifier?data.user_identifier:""}&status=${data.status?data.status:""}`,
            { only: ['filteredData']}
        )
        setTableDataLoading(false)
    }

    function filterByTopButtons(status) {
        router.visit(`${route('dashboard.transactions')}?status=${status}`, { only: ['filteredData'] })
    }

    useEffect(() => {
        let count = 0;
        for(let i = 0; i < stats?.transactions.length; ++i) {
            if(stats.transactions[i].status === "PEND_REFUND") count++;
        }
        setRefundPendingValue(count);
        if(prevRefundPendingValue < count && prevRefundPendingValue >= 0) {
            // console.log('prev', prevRefundPendingValue)
            setRefundPendingAlert(true)
            beep();
        }
        setPrevRefundPendingValue(refundPendingValue)
    }, [stats])



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Transactions</h2>}
        >
            <Head title="Transactions" />

            <div className="py-12">
                <Modal
                    show={refundPendingAlert}
                    onClose={()=>setRefundPendingAlert(false)}
                >
                    <div className="h-fit flex flex-col justify-center">
                        <div className="bg-yellow-300 px-3 py-2 flex flex-col">
                            <h3 className="font-extrabold text-lg">Notification</h3>
                            <span className="text-xs tracking-tight">Some requests is awaiting for your action.</span>
                        </div>
                        <div className="p-3">
                            <p>There might be a new refund pending entry.</p>
                        </div>
                    </div>
                </Modal>

                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-col gap-5">
                    {/* TRX STATS */}
                    <div className="bg-white px-5 py-3 rounded-lg flex flex-col gap-2 w-full">
                        <div className='flex gap-2 items-baseline'>
                            <h2 className="font-bold text-xl">Transactions</h2>
                            <span className='uppercase font-bold text-xs text-gray-400'>Last 7 days</span>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
                                <h3>Total</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg">{stats.transactions.UNPAID + stats.transactions.PENDING + stats.transactions.FAILED + stats.transactions.SUCCESS}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow' onClick={_=>filterByTopButtons("UNPAID")}>
                                <h3>Unpaid</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-slate-500">{transactionCount("UNPAID")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow' onClick={_=>filterByTopButtons("SUCCESS")}>
                                <h3>Success</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-green-600">{transactionCount("SUCCESS")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow' onClick={_=>filterByTopButtons("PENDING")}>
                                <h3>Pending</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-yellow-600">{transactionCount("PENDING")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow' onClick={_=>filterByTopButtons("FAILED")}>
                                <h3>Failed</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-red-600">{transactionCount("FAILED")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* REFUND STATS */}
                    <div className="bg-white px-5 py-3 rounded-lg flex flex-col gap-2 w-full">
                        <div className='flex gap-2 items-baseline'>
                            <h2 className="font-bold text-xl">Refunds</h2>
                            <span className='uppercase font-bold text-xs text-gray-400'>Last 7 days</span>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
                                <h3>Total</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg">{stats.transactions.PEND_REFUND + stats.transactions.SUCC_REFUND + stats.transactions.CANC_REFUND}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow' onClick={_=>filterByTopButtons("PEND_REFUND")}>
                                <h3>Pending</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-yellow-600">{transactionCount("PEND_REFUND")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow' onClick={_=>filterByTopButtons("SUCC_REFUND")}>
                                <h3>Success</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-green-600">{transactionCount("SUCC_REFUND")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow' onClick={_=>filterByTopButtons("CANC_REFUND")}>
                                <h3>Canceled</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-red-600">{transactionCount("CANC_REFUND")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* DATA TABLE */}
                    <div className="bg-white px-5 py-3 rounded-lg flex flex-col gap-2 w-full">
                        <div className='flex gap-2 items-baseline'>
                            <h2 className="font-bold text-xl">Search</h2>
                            <span className='uppercase font-bold text-xs text-gray-400'></span>
                        </div>
                        <form className="flex flex-row flex-wrap gap-1 items-end" onSubmit={submitSearch}>
                            <div>
                                <InputLabel>Invoice</InputLabel>
                                <TextInput className='py-1' onChange={(e)=>setData('invoice', e.target.value)}></TextInput>
                            </div>
                            <div>
                                <InputLabel>Reference ID</InputLabel>
                                <TextInput className='py-1' onChange={(e)=>setData('ref_id', e.target.value)}></TextInput>
                            </div>
                            <div>
                                <InputLabel>User Identifier</InputLabel>
                                <TextInput className='py-1 ' onChange={(e)=>setData('user_identifier', e.target.value)}></TextInput>
                            </div>
                            <div>
                                <InputLabel>Transaction Status</InputLabel>
                                <select className='py-1 text-gray-700 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm' onChange={(e)=>setData('status', e.target.value)}>
                                    <option>any</option>
                                    {
                                        transactionStatuses.map((e, i) => {
                                            return <option key={i} value={e}>{e}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div className="flex flex-row gap-1">
                                <PrimaryButton type="submit">Search</PrimaryButton>
                                <SecondaryButton onClick={reloadData}>Force Reload</SecondaryButton>
                            </div>
                        </form>
                        <div>
                            <DataTable
                                columns={columns}
                                data={filteredData}
                                expandableRows
                                pagination
                                fixedHeader
                                progressPending={tableDataLoading}
                                dense
                                highlightOnHover
                                expandableRowsComponent={DataTableExpand}
                                expandableRowsComponentProps={{"permissions": permissions}}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
