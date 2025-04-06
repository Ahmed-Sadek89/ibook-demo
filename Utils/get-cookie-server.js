import { cookies } from "next/headers";

export async function getCookie(name) {
  return (await cookies()).get(name)?.value;
}