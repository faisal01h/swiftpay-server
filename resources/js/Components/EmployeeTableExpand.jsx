import axios from "axios"
import InputLabel from "./InputLabel"
import PrimaryButton from "./PrimaryButton"
import RoleBadge from "./RoleBadge"
import { useState } from "react"
import { router } from "@inertiajs/react"
import DangerButton from "./DangerButton"

const dateLocaleOpts = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}

export default function({ data, canAssignRole, roles, canDeleteUser }) {
    // console.log(data, canAssignRole)
    const [ assignRoleId, setAssignRoleId ] = useState();
    const [ removeRoleId, setRemoveRoleId ] = useState();
    const [ sortedRoles, setSortedRoles ] = useState(data.roles.sort((e, f) => f.detail.importance - e.detail.importance));

    function assign() {
        axios.post(route('wapi.assign-role'), {
            user_id: data.id,
            role_id: assignRoleId
        })
        .then((e) => {
            console.log(e)
            router.reload(['data'])
        })
        .catch((e) => {
            console.error(e)
        })
    }

    function remove() {
        axios.post(route('wapi.remove-role'), {
            user_id: data.id,
            role_id: removeRoleId
        })
        .then((e) => {
            console.log(e)
            router.reload(['data'])
        })
        .catch((e) => {
            console.error(e)
        })
    }

    function deleteUser() {
        axios.post(route('dashboard.management.user'), {
            user_id: data.id
        })
        .then((e) => {
            router.reload()
        })
        .catch(console.error)
    }

    return (
        <div className="px-3 py-3 flex flex-col gap-2 border rounded-b-md">
            <div className="grid grid-cols-2">
                <div className="grid grid-rows-2">
                    <div className="grid grid-cols-2">
                        <b>Name</b>
                        <p>{data.name}</p>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Created at</b>
                        <p>{new Date(data.created_at).toLocaleString('id-ID', dateLocaleOpts)}</p>
                    </div>
                </div>
                <div className="grid grid-rows-2">
                    <div className="grid grid-cols-2">
                        <b>Roles</b>
                        <div className="flex gap-2 flex-wrap">
                            {
                                sortedRoles?.map((e, i) => {
                                    return (
                                        <RoleBadge
                                            role={e.detail.name}
                                            skew={false}
                                            hoverEnlarge={false}
                                            key={i}
                                        >
                                            {e.detail.name === 'BOT' ? "🤖 BOT" : e.detail.name}
                                        </RoleBadge>
                                    )
                                })
                            }
                        </div>
                    </div>
                    <div className="grid grid-cols-2">
                        <b>Last update</b>
                        <p>{new Date(data.updated_at).toLocaleString('id-ID', dateLocaleOpts)}</p>
                    </div>
                </div>
            </div>
            {
                canAssignRole || canDeleteUser ? <hr /> : ""
            }
            {
                canAssignRole ?
                <div className="flex flex-row gap-1">
                    <div className="grid grid-cols-3 gap-2">
                        <InputLabel>Assign Role</InputLabel>
                        <select className="rounded-md border-gray-600 py-1 px-2" onChange={e=>setAssignRoleId(e.target.value)}>
                            <option>Select Role</option>
                            {
                                roles.map((role, i) => {
                                    return (
                                        <option key={i} value={role.id}>{role.name}</option>
                                    )
                                })
                            }
                        </select>
                        <PrimaryButton className="w-fit" onClick={assign}>Assign</PrimaryButton>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                        <InputLabel>Remove Role</InputLabel>
                        <select className="rounded-md border-gray-600 py-1 px-2 min-w-[100px]" onChange={e=>setRemoveRoleId(e.target.value)}>
                            <option>Select Role</option>
                            {
                                data.roles?.map((role, i) => {
                                    return (
                                        <option key={i} value={role.detail.id}>{role.detail.name}</option>
                                    )
                                })
                            }
                        </select>
                        <PrimaryButton className="w-fit" onClick={remove}>Remove</PrimaryButton>
                    </div>
                </div> : ""
            }
            {
                canDeleteUser ?
                <div className="flex">
                    <DangerButton onClick={deleteUser}>Delete User</DangerButton>
                </div> : ""
            }
            {/* <div className=" bg-gray-700 text-gray-200 rounded-lg gap-2 flex flex-col">
                <div className="py-1 px-3 bg-slate-800 rounded-t-lg">
                    <b className="">Raw JSON</b>
                </div>
                <p className="break-all px-3 pb-2 font-mono">{JSON.stringify(data)}</p>
            </div> */}
        </div>
    )
}
