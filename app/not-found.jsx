import Image from "next/image";
import Link from "next/link";

const NotFound = () => {
    return (
        <div className="notFound">
            <Image src="/imgs/page-not-found.png" alt="notFound" width={200} height={200}/>
            <h3>الصفحة غير متاحة</h3>
            <button>
                <Link href={"/home"} style={{textDecoration: "none"}}>الرجوع للصفحة الرئيسية</Link>
            </button>
        </div>
    );
};

export default NotFound;