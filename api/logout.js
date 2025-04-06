'use client'
import Cookies from 'universal-cookie'
import { apiClient } from '../Utils/axios'

export const logout = async () => {
  const cookie = new Cookies()
  const token = cookie.get('ibook-auth')
  try {
    const response = await apiClient.post(
      '/crm/students/auth/logout?api_key=402784613679330',
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`
        },
        params: {
          api_key: 402784613679330
        }
      }
    )
    console.log({ response: response.data })
    return response.data
  } catch (error) {
    console.error(`Unexpected Error: ${error.message}`)
    throw new Error(error.message)
  }
}
