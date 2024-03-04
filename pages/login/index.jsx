// --- Login Page ---

// Import modules
import { useState } from "react"
import { useCookies } from "react-cookie"
import { useRouter } from "next/router"
import useSWR from 'swr'

import Link from "next/link"
import Head from "next/head"

// Import styling
import styles from "./login.module.scss"

// API fetcher
const fetcher = (url, token) => fetch(url, { headers: { "Authorization": token } }).then((res) => res.json())

// Login page
export default function Login() {

    // Blocks the login form when 'true'
    const [ SentRequest, setSentRequest ] = useState(false)

    // Show banner when invalid credentials
    const [ InvalidCred, showInvalidCred ] = useState(false)

    // Allow the getting & setting of cookies
    const [ cookies, setCookie, removeCookie ] = useCookies()

    // Allow page navigation
    const router = useRouter()

    // Check if the login token is valid
    const token = cookies.token
    const { data, error, isLoading } = useSWR([ "/api/login/check", token ], () => fetcher("/api/login/check", token))

    // Check if user is already logged in
    if (data == true) {

        // Redirect to dashboard
        router.push("/dashboard")

    } else if (isLoading == false) {

        // Login form submit
        function login(e) {
            e.preventDefault()
            
            // Lock the form
            setSentRequest(true)

            // Get form data
            const data = {
                username: e.target.username.value || "",
                password: e.target.password.value || ""
            }
            const JSONdata = JSON.stringify(data)

            // Send data to API backend
            fetch("/api/login", { method: "POST", body: JSONdata })
                .then((res) => res.text())
                .then((resData) => {
                    
                    // Check if data returns a 'token'
                    if (resData != 401) {

                        // Remove any old tokens
                        removeCookie("token")

                        // TODO: Use API to remove old tokens from DB

                        // Set token
                        setCookie("token", resData)

                        // Unlock form
                        setSentRequest(false)

                        // Go to the dashboard
                        router.push("/dashboard")

                    } else {
                        
                        // Toggle invalid banner
                        showInvalidCred(true)

                        // Unlock form
                        setSentRequest(false)

                        // Disable invalid banner after 3 seconds
                        setTimeout(() => {
                            showInvalidCred(false)
                        }, 3000)
                    }
                }
            )
        }

        // Login page
        return (
            <>
                <Head>
                    <title>Login - Cardify</title>
                </Head>

                <div className={styles.main}>
                    <div className={InvalidCred ? styles.invalid : styles.invalid + " hidden"} onClick={() => showInvalidCred(false)}>
                        <p>Invalid username or password.</p>
                    </div>
                    
                    <div className={styles.wrapper}>

                        <div className={styles.logoWrapper}>
                            <img src="/logo.png" />
                            <p>Cardify</p>
                        </div>

                        <form onSubmit={login}>
                            <fieldset disabled={SentRequest}>

                                <label htmlFor="username" className={styles.label}>Username</label>
                                <input
                                    type="username"
                                    name="username"
                                    id="username"
                                    className={styles.input}
                                    required
                                />
                                
                                <label htmlFor="password" className={styles.label}>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    className={styles.input}
                                    required
                                />

                                <div>
                                    <Link href="/signup">Sign Up</Link>

                                    <button
                                        type="submit"
                                        className={ SentRequest ? styles.submit + " " + styles.submitLoading : styles.submit }
                                    >Log In</button>
                                </div>

                            </fieldset>
                        </form>
                    </div>
                </div>
            </>
        )
    }
}