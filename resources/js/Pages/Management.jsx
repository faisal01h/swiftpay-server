import EmployeeTableExpand from '@/Components/EmployeeTableExpand';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ManagementLayout from '@/Layouts/ManagementLayout';
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
            row.roles = row.roles.sort((e, f) => f.detail.importance - e.detail.importance)
            let roles = "";
            for(let i = 0; i < row.roles.length; ++i) {
                roles+=`${i>0 ? ', ':''}${row.roles[i].detail.name}`
            }

            return roles
        },
    },
];

export default function Management({ auth, employees, canAssignRole = false, roles, canDeleteUser = false }) {

    // console.log('cAR', employees)

    return (
        <ManagementLayout
            auth={auth}
            // header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Management</h2>}
        >
            <Head title="Management" />

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
                        expandableRowsComponent={EmployeeTableExpand}
                        expandableRowsComponentProps={{canAssignRole, roles, canDeleteUser}}
                    />
                </div>
            </div>

        </ManagementLayout>
    );
}
