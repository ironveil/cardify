// --- Main Dashboard Page ---

// Import modules
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import Head from "next/head"
import useSWR from 'swr'

// Import components
import GroupList from "../../components/GroupList"
import DeckList from "../../components/DeckList"

// Import styling
import styles from "./dashboard.module.scss"
import { LuTrash2 } from "react-icons/lu"

// API fetcher
const fetcher = (url, token) => fetch(url, { headers: { "Authorization": token } }).then((res) => res.json())

// Dashboard page
export default function Dashboard() {

    // Get the token from cookies
    const [ cookies ] = useCookies()
    const token = cookies.token

    // Allow page navigation
    const router = useRouter()

    // The current group selected
    const current = router.query.group || "all"

    // Check login
    const loginUrl = "/api/login/check"
    const { data: validToken, isLoading: loadingToken } = useSWR([ loginUrl, token ], () => fetcher(loginUrl, token))

    // Get page title data
    const titleUrl = "/api/groups/getTitle?group=" + current
    const { data: pageTitle } = useSWR([titleUrl, token], () => fetcher(titleUrl, token))

    // Check if token is invalid
    if (validToken == false) {

        // Tell the client to redirect to the login page
        router.push("/login")

    // If token is valid
    } else if (loadingToken == false) {

        // If the page content hasn't loaded yet, return a loading page
        if (!pageTitle) return (
            <>
                <Head>
                    <title>Loading - Cardify</title>
                </Head>

                <div className={styles.main}>
                    <DashboardGroups token={token} />

                    <div className={styles.content + " " + styles.center}>

                        <p>Loading...</p>

                    </div>
                </div>
            </>
        )
        
        // If the page content has been retrieved, return the content
        if (pageTitle) return (
            <>
                <Head>
                    <title>{pageTitle.name} - Cardify</title>
                </Head>

                <div className={styles.main}>
                    <DashboardGroups token={token} />

                    <DashboardContent
                        token={token}
                        title={pageTitle.name}
                        current={current}
                        router={router} />
                </div>
            </>
        )
    }
}

// Dashboard groups sidebar
export function DashboardGroups({ token, refresh }) {

    // Get dashboard groups
    const groupsUrl = "/api/groups/get"
    const { data } = useSWR([groupsUrl, token], () => fetcher(groupsUrl, token), { refreshInterval: 1000 })
    
    // Render dashboard groups with correct data
    if (data) return <GroupList groups={data} refresh={refresh} />
}

// Dashboard main content
export function DashboardContent({ token, title, current, router }) {

    // Get all decks under specific group
    const deckUrl = "/api/decks/get?group=" + current
    const { data, isLoading } = useSWR([deckUrl, token], () => fetcher(deckUrl, token))
    
    // Display loading page if content hasn't been retrieved yet
    if (isLoading) return (
        <div className={styles.content + " " + styles.center}>

            <p>Loading...</p>

        </div>
    )

    // Render the main content
    if (data) {

        // Delete curret group function
        function deleteGroup(e) {
            e.preventDefault()

            fetch("/api/groups/delete?group=" + current, { headers: { "Authorization": token } })
                .then(() => {
                    router.push("/dashboard")
                }
            )
        }

        // Render the main content
        return (
            <div className={styles.content}>

                { current != "all" && <button className={styles.delete} onClick={deleteGroup}><LuTrash2 /></button> }

                <p className={styles.heading}>{title}</p>
            
                <DeckList decks={data} current={current} />
            
            </div>
        )
    }
}