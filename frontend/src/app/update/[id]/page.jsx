

'use client'

import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useParams, useRouter } from 'next/navigation'


export default function UpdateProfile() {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const router = useRouter()

    const params = useParams();


    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }



    const update = async () => {

        toast.dismiss()
        toast.loading('Updating..')


        const token = localStorage.getItem('token');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "name": name,
            "email": email,
        });

        console.log(raw);

        var requestOptions = {  
            method: 'PUT',
            headers: myHeaders,
            body: raw,
        };

        const response = await fetch(`http://127.0.0.1:8000/users/${params.id}`, requestOptions)
        console.log(response)

        if (response.ok) {
            let res = await response.json();
            router.push('/');
            toast.dismiss()
            toast.success('Profile updated successfully!')
            console.log(res)

        }
        else if(response.status === 400){
            toast.dismiss()
            toast.error("User already exists!")
        }
        else if (response.status === 404) {
            toast.dismiss()
            toast.error("User doesn't exists!")
        }
        else {
            toast.dismiss()
            toast.error('Failed to update profile')
        }

    }

    const handleUpdateClick = (e) => {
        e.preventDefault()

        if(name === ""){
            toast.dismiss()
            toast.error("Name required!")
        }
        else if (email === "") {
            toast.dismiss()
            toast.error("Email required!")
        }
        else if (!validateEmail(email)) {
            toast.dismiss()
            toast.error('Please enter valid email!')
        }

        else {
            update();
        }
    }



    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0 h-screen">

                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Update profile
                        </h1>
                        <form className="space-y-2 md:space-y-6 " action="#">

                            <div>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                                <input type="name" name="name" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Nikhil Magar" required="" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>

                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                                <input type="email" name="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>

                            <button onClick={handleUpdateClick} type="submit" className="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">Sign In</button>

                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
