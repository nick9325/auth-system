'use client'

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';



export default function Homepage() {

    const [userData, setUserData] = useState(null);

    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();



    const fetchUser = async () => {


        const token = localStorage.getItem('token');
        console.log(token)
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);


        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        let response = await fetch(`http://127.0.0.1:8000/users/me/`, requestOptions)
        console.log(response)

        if (response.ok) {
            let result = await response.json();
            console.log(result);
            setUserData(result);
        }
        else if (response.status === 401) {
            router.push('/login')
            localStorage.setItem('token', '')
        }
        else {

            router.push('/login')

        }


    }

    const handleSignOutClick = () => {

        localStorage.setItem('token', '');
        router.push('/login')

    }
    const handleUpdateClick = () => {

        router.push(`/update/${userData?.id}`)

    }

    const delete_profile=async()=>{

        toast.dismiss()
        toast.loading('Updating..')


        const token = localStorage.getItem('token');
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        var requestOptions = {  
            method: 'DELETE',
            headers: myHeaders,
        };

        const response = await fetch(`http://127.0.0.1:8000/users/${userData?.id}`, requestOptions)


        if (response.ok) {
            let res = await response.json();
            router.push('/register');
            toast.dismiss()
            toast.success('Profile deleted successfully!')
            console.log(res)

        }
        else if (response.status === 404) {
            toast.dismiss()
            toast.error("User doesn't exists!")
        }
        else {
            toast.dismiss()
            toast.error('Failed to delete profile')
        }


    }


    const handleDeleteClick = () => {
        
        alert('Are you sure you want to delete your profile?')

        delete_profile()

    }

    useEffect(() => {
        fetchUser()
        setIsMounted(true);
    }, [])


    return (
        <>
        
        
        {userData ?
            <div className={`flex flex-col items-center justify-center text-center transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <h1 className='text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent'>
                    Welcome, {userData?.name}
                </h1>
                <h2 className='text-2xl mt-2 text-gray-700'>
                    You have successfully logged in
                </h2>
                <div className='pt-8 flex flex-col gap-2'>
                    <button
                        onClick={handleSignOutClick}
                        name='signout'
                        className='w-full max-w-xs text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition-transform transform hover:scale-105'
                    >
                        Sign out
                    </button>
                    <button
                        onClick={handleUpdateClick}
                        name='update'
                        className='w-full max-w-xs text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition-transform transform hover:scale-105 text-nowrap'
                    >
                        Update profile
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        name='delete'
                        className='w-full max-w-xs text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition-transform transform hover:scale-105 text-nowrap'
                    >
                        Delete account
                    </button>
                </div>
            </div> : <div role="status">
                <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        }

        </>
    )
}
