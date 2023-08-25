import DataTableExpand from '@/Components/DataTableExpand';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';

const columns = [
    {
        name: 'Name',
        selector: row => row.name,
    },
    {
        name: 'Roles',
        selector: (row) => {
            let roles = "";
            for(let i = 0; i < row.roles.length; ++i) {
                roles+=`${i>0 ? ', ':''}${row.roles[i].detail.name}`
            }
            return roles
        },
    },
];

export default function Management({ auth, employees }) {

    // console.log(employees)

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Management</h2>}
        >
            <Head title="Management" />

            <div className="py-12">


                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex flex-row gap-5">
                    <div>SIDEBAR</div>
                    <div className='bg-white w-full px-5 py-3 rounded-lg flex-grow'>
                        <div>
                            <h2 className='font-bold text-2xl'>Employees</h2>
                        </div>
                        <div>
                            <DataTable
                                columns={columns}
                                data={employees}
                                expandableRows
                                pagination
                                fixedHeader
                                progressPending={false}
                                dense
                                highlightOnHover
                                expandableRowsComponent={DataTableExpand}
                            />
                        </div>
                    </div>
                </div>
            </div>

        </AuthenticatedLayout>
    );
}
