import { redirect } from 'next/navigation'
import { getCookie } from '../../Utils/get-cookie-server'

const layout = async ({ children }) => {
  // const role = await getCookie('ibook-role')
  // if (role !== 'student') {
  //   redirect('/parent')
  // }
  
  return <>{children}</>
}

export default layout
