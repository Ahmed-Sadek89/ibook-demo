import { redirect } from 'next/navigation'
import { getCookie } from '../../../Utils/get-cookie-server';

const layout = async ({ children }) => {
    // const role = await getCookie('ibook-role');
    // const token = await getCookie('ibook-auth')
    // if (token && role === 'parent') {
    //     redirect('/parent')
    // }
    // if (token && role === 'student') {
    //     redirect('/home')
    // }

    return <>{children}</>
}

export default layout
