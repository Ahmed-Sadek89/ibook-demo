import { redirect } from 'next/navigation'
import { getCookie } from '../../Utils/get-cookie-server'

const layout = async ({ children }) => {
  // const role = await getCookie('ibook-role')
  // if (role !== 'parent') {
  //   redirect('/home')
  // }
  
  return <>{children}</>
}

export default layout
