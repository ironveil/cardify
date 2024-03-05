// --- New Item Page ---

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
export default function New() {

    // Get the token from cookies
    const [ cookies ] = useCookies()
    const token = cookies.token    

    // Allow page navigation
    const router = useRouter()

    // Check login
    const loginUrl = "/api/login/check"
    const { data: validToken, isLoading: loadingToken } = useSWR([ loginUrl, token ], () => fetcher(loginUrl, token))

    // Get current option
    const current = router.query.item

    // Check if token is invalid
    if (validToken == false) {

        // Tell the client to redirect to the login page
        router.push("/login")

    // If token is valid
    } else if (loadingToken == false) {

        // New group function
        function newGroup(e) {
            e.preventDefault()

            // Get the data from the form
            const data = { name: e.target.name.value || "" }
            const JSONdata = JSON.stringify(data)

            // Create the new group via API
            fetch("/api/groups/new", { method: "POST", body: JSONdata, headers: { "Authorization": token } })
                .then((res) => res.json())
                .then((res) => {
                    
                    // Redirect to new group
                    router.push("/dashboard?group=" + res.id)

                }
            )
        }

        // New deck function
        function newDeck(e) {
            e.preventDefault()

            // Get the data from the form
            const data = { name: e.target.name.value || "" }
            const JSONdata = JSON.stringify(data)

            // Get the wanted group
            const wantedGroup = router.query.group

            // Create the new deck via API
            fetch("/api/decks/new?group=" + wantedGroup, { method: "POST", body: JSONdata, headers: { "Authorization": token } })
                .then((res) => res.json())
                .then((res) => {
                    
                    // Redirect to new group
                    router.push("/dashboard?group=" + wantedGroup)

                }
            )
        }

        // Render if the user wants a new group...
        if (current == "group") { return (

            <>
                <Head>
                    <title>New Group - Cardify</title>
                </Head>

                <div className={styles.main}>
                    <DashboardGroups token={token} />

                    <div className={styles.content}>
                        <p className={styles.heading}>New Group</p>

                        <form className={styles.new} onSubmit={newGroup}>
                            <input type="text" name="name" id="name" autoFocus required />
                            <button type="submit">Create</button>
                        </form>
                    </div>
                </div>
            </>

        // ...or a new deck
        ) } else if (current == "deck") { return (

            <>
                <Head>
                    <title>New Deck - Cardify</title>
                </Head>

                <div className={styles.main}>
                    <DashboardGroups token={token} />

                    <div className={styles.content}>
                        <p className={styles.heading}>New Deck</p>

                        <form className={styles.new} onSubmit={newDeck}>
                            <input type="text" name="name" id="name" autoFocus required />
                            <button type="submit">Create</button>
                        </form>
                    </div>
                </div>
            </>

        // Fallback if the query matches neither
        )} else {

            // Go back to the main dashboard
            router.push("/dashboard")

        }
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