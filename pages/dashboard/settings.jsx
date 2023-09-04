// --- Dashboard Settings Page ---

// Import modules
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import Head from "next/head"
import useSWR from 'swr'

// Import components
import GroupList from "../../components/GroupList"

// Import styling
import styles from "./dashboard.module.scss"

// API fetcher
const fetcher = (url, token) => fetch(url, { headers: { "Authorization": token } }).then((res) => res.json())

// Settings page
export default function Settings() {

    // Get the token from cookies
    const [ cookies, setCookies, removeCookies ] = useCookies()
    const token = cookies.token    

    // Allow page navigation
    const router = useRouter()

    // Check login
    const loginUrl = "/api/login/check"
    const { data: validToken, isLoading: loadingToken } = useSWR([ loginUrl, token ], () => fetcher(loginUrl, token))

    // Check if token is invalid
    if (validToken == false) {

        // Tell the client to redirect to the login page
        router.push("/login")

    // If token is valid
    } else if (loadingToken == false) {

        // Logout button function
        function logout(e) {
            e.preventDefault()

            // Remove the 'token' cookie
            removeCookies("token")

            // Delete token from db
            fetch("/api/login/remove", { headers: { "Authorization": token } })

            // Redirect to login page
            router.push("/login")
        }

        // Render the content
        return (
            <>
                <Head>
                    <title>Settings - Cardify</title>
                </Head>

                <div className={styles.main}>
                    <DashboardGroups token={token} />

                    <div className={styles.content}>
                        <p className={styles.heading}>Settings</p>

                        <div className={styles.settings}>
                            <button className={styles.logout} onClick={logout}>Logout</button>
                        </div>
                        
                    </div>
                </div>
            </>
        )
    }
}

// Dashboard groups sidebar
export function DashboardGroups({ token }) {

    // Get dashboard groups
    const groupsUrl = "/api/groups/get"
    const { data } = useSWR([groupsUrl, token], () => fetcher(groupsUrl, token))
    
    // Render dashboard groups with correct data
    if (data) return <GroupList groups={data} />
}