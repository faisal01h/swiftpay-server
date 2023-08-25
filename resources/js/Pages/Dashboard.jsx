import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm, useRemember } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { FaToolbox, FaWhatsapp, FaWrench } from 'react-icons/fa6';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import DataTable from 'react-data-table-component';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Dropdown from '@/Components/Dropdown';
import SecondaryButton from '@/Components/SecondaryButton';

const transactionStatuses = ["SUCCESS", "PENDING", "UNPAID", "FAILED", "PEND_REFUND", "SUCC_REFUND", "CNCL_REFUND"]

export default function Dashboard({ auth, stats, filteredData }) {

    const [ autofetch, setAutofetch ] = useState(true);
    const [ prevRefundPendingValue, setPrevRefundPendingValue ] = useState(-1);
    const [ refundPendingValue, setRefundPendingValue ] = useState(-1);
    const [ refundPendingAlert, setRefundPendingAlert ] = useRemember(false);
    const [ tableDataLoading, setTableDataLoading ] = useState(false);
    const [ unformattedTd, setUnformattedTd ] = useState([])
    const [ tableData, setTableData ] = useState([
        // {
        //     id: 1,
        //     invoice:    <div className='flex gap-2 items-center'>
        //                     <span>MLBB_897398313AF</span>
        //                     <button
        //                         className='p-1 my-1 rounded bg-slate-800 text-white text-xs'
        //                         onClick={e=>{
        //                             e.preventDefault();
        //                             navigator.clipboard.writeText('MLBB_897398313AF');
        //                         }}
        //                     >
        //                         COPY
        //                     </button>
        //                 </div>,
        //     ref_id: <div className='flex gap-2 items-center'>
        //                 <span>1923</span>
        //                 <button
        //                     className='p-1 my-1 rounded bg-slate-800 text-white text-xs'
        //                     onClick={e=>{
        //                         e.preventDefault();
        //                         navigator.clipboard.writeText('1923');
        //                     }}
        //                 >
        //                     COPY
        //                 </button>
        //             </div>
        // },
        // {
        //     id: 2,
        //     invoice: '00FF_992903BC901',
        //     ref_id: '1984',
        // },
    ]);

    const { data, setData, post, processing, errors, reset } = useForm({
        invoice: null,
        ref_id: null,
        status: null
    });

    function fillTable(source) {
        setTableData([])
        if(tableData.length === 0) {
            for(let i = 0; i < source.length; i++) {
                setTableData([...tableData, {
                    id: source[i].id,
                    invoice: source[i].invoice,
                    ref_id: source[i].ref_id
                }])
            }
            console.log('td',tableData)
        }
    }

    useEffect(() => {
        fillTable(unformattedTd);
    }, [unformattedTd])

    function transactionCount(status) {
        return stats.transactions[status];
    }

    const reloadData = () => {
        if(autofetch) router.reload({ only: ['data'] })
    }

    const columns = [
        {
            name: 'Invoice',
            selector: row => row.invoice,
        },
        {
            name: 'RefID',
            selector: row => row.ref_id,
        },
    ];

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




    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">

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
                                    <span className="text-lg">{transactionCount("UNPAID") + transactionCount("SUCCESS") + transactionCount("PENDING") + transactionCount("FAILED")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
                                <h3>Unpaid</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-slate-500">{transactionCount("UNPAID")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
                                <h3>Success</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-green-600">{transactionCount("SUCCESS")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
                                <h3>Pending</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-yellow-600">{transactionCount("PENDING")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
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
                                    <span className="text-lg">{transactionCount("PEND_REFUND") + transactionCount("SUCC_REFUND") + transactionCount("CANC_REFUND")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
                                <h3>Pending</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-yellow-600">{transactionCount("PEND_REFUND")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
                                <h3>Success</h3>
                                <div className="text-right flex justify-between gap-3 items-end">
                                    <span className="uppercase text-xs"></span>
                                    <span className="text-lg text-green-600">{transactionCount("SUCC_REFUND")}</span>
                                </div>
                            </div>
                            <div className='bg-white shadow-lg px-3 py-2 rounded-lg flex-grow'>
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
                            <h2 className="font-bold text-xl">Insights</h2>
                            <span className='uppercase font-bold text-xs text-gray-400'>Unavailable</span>
                        </div>
                        <div>
                            <div className='flex items-center justify-center text-yellow-400'>
                                <FaWrench />
                            </div>
                            <p className='uppercase text-gray-400 font-bold text-sm text-center'>This section is under development</p>
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
