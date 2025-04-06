'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
    error,
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="notFound">
            <Image src="/imgs/page-not-found.png" alt="notFound" width={200} height={200} />
            <h3>الصفحة غير متاحة</h3>
            <p className='text-main text-xl italic'>{error.message}</p>
            <button>
                <Link href={"/home"} style={{ textDecoration: "none" }}>الرجوع للصفحة الرئيسية</Link>
            </button>
        </div>
    )
}