import { useState } from "react"
import DangerButton from "./DangerButton"
import PrimaryButton from "./PrimaryButton"
import SecondaryButton from "./SecondaryButton"
import { FaCircleExclamation, FaExclamation, FaStop } from "react-icons/fa6"
import axios from "axios"
import { Link, router, useForm } from "@inertiajs/react"

const dateLocaleOpts = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
}

export default function CategoryTableExpand({ data }) {

    const { data: imData, setData: setImData, post, errors } = useForm({
        image: null,
        type: null,
        category_id: data.id
    });

    function submit() {
        post(route('dashboard.categories.image'), {
            onSuccess: (e) => {
                router.reload()
            },
            onError: (e) => {
                console.log(e)
            }
        });
    }




    return (
        <div className="px-3 py-3 flex flex-col gap-2 border rounded-b-md">

            <div>
                <h4>Set Image</h4>
                <input type="file" onChange={e=>setImData('image', e.target.files[0])} />
            </div>

            <div>
                <select onChange={e=>setImData('type', e.target.value)}>
                    <option>Select Type</option>
                    <option value={'image'}>Image</option>
                    <option value={'cover'}>Cover Image</option>
                </select>
            </div>

            <div className="flex items-center gap-3">

                <SecondaryButton onClick={submit}>Save</SecondaryButton>


            </div>
        </div>
    )
}
