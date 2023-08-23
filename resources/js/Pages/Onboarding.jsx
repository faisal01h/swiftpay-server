import PrimaryButton from '@/Components/PrimaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FaFloppyDisk, FaWhatsapp } from 'react-icons/fa6';
import Select from 'react-select';

export default function Onboarding({ auth, roles }) {



    const { data, setData, post, processing, errors, reset } = useForm({
        name: auth.user.name.toUpperCase(),

    });

    const submit = (e) => {
        e.preventDefault();
        console.log(data)
        let dt = `Halo, saya ingin mengkonfirmasi akun saya untuk ${import.meta.env.VITE_APP_NAME} nomor ${data.roomLabel} atas nama *${data.name}* dengan nomor identitas *${data.idNumber}*. Terima kasih.`;
        document.location.href = `https://wa.me/6285733710858/?text=${encodeURI(dt)}`;
        // post(route('login'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            mode={"onboarding"}

        >
            <Head title="Onboarding" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 flex flex-col gap-2 overflow-auto">
                            <h1 className="font-bold text-2xl">Halo, {auth.user.name}! Anda belum terdaftar pada sistem.</h1>
                            <form onSubmit={submit}>
                                <p>
                                    Anda telah ditambahkan sebagai {" "}
                                    {
                                        roles ? roles.map((e, i) => {
                                            return (
                                                <b key={i}>{e} {i >= 0 ? ", ":" "}</b>
                                            )
                                        }) : "?"
                                    }
                                    tetapi kami memerlukan verifikasi lebih lanjut.
                                </p>
                                <div className="flex flex-col mt-5 px-5">
                                    <b>Masukkan informasi anda</b>
                                    <div className="flex flex-col gap-1 my-3">
                                        <div className="flex flex-col">
                                            <label htmlFor="name">Nama Lengkap</label>
                                            <input type='text' id="name" className=" border-1 border-gray-300 outline-blue-600 rounded-lg" defaultValue={data.name} onChange={(e) => setData('name', e.currentTarget.value)} />
                                        </div>
                                        <div className="flex flex-col">
                                            <label htmlFor="name">Email</label>
                                            <input type='email' id="email" className=" border-1 border-gray-300 bg-gray-200 outline-blue-600 rounded-lg" defaultValue={auth.user.email} disabled />
                                        </div>
                                    </div>

                                    <PrimaryButton className="flex items-center gap-1 shadow w-fit px-3 py-2 rounded-lg cursor-pointer" type='submit'>
                                        <FaFloppyDisk />
                                        <span>{"Simpan"}</span>
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
