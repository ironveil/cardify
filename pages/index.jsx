// --- Index Page ---

// Import modules
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import useSWR from 'swr'

// Import styling
import styles from "./index.module.scss"

// API fetcher
const fetcher = (url, token) => fetch(url, { headers: { "Authorization": token } }).then((res) => res.json())

// Index page
export default function Index() {

    // Get the token from cookies
    const [ cookies ] = useCookies()
    const token = cookies.token

    // Allow page navigation
    const router = useRouter()

    // Check if the login token is valid
    const { data, error, isLoading } = useSWR([ "/api/login/check", token ], () => fetcher("/api/login/check", token))

    // If there is an error in loading the token
    if (error) return (
        <div className={styles.error + " " + styles.main}>
            <div>
                <p>Error</p>
                <p>{error.toString()}</p>
            </div>
        </div>
    )

    // While loading
    if (isLoading) return (
        <div className={styles.loading + " " + styles.main}>
            <img src="/logo.png" />
        </div>
    )

    // Navigate based on token valid-ness
    if (data == true) {
        router.push("/dashboard")
    } else {
        router.push("/login")
    }
}