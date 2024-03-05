// --- Signup Page ---

// Import modules
import { useState } from "react"
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"

import Head from "next/head"
import Link from "next/link"

// Import styling
import styles from "./signup.module.scss"

// Signup page
export default function Signup() {
    
    // Blocks the login form when 'true'
    const [ SentRequest, setSentRequest ] = useState(false)

    // Allow the setting of cookies
    const [ cookies, setCookie, removeCookie ] = useCookies()

    // Show banner on error
    const [ InvalidCred, showInvalidCred ] = useState("")

    // Allow page navigation
    const router = useRouter()

    // Signup form submit
    function signup(e) {
        e.preventDefault()

        // Lock the form
        setSentRequest(true)

        // Get form data
        const data = {
            username: e.target.username.value || "",
            password: e.target.password.value || "",
            passwordConfirm: e.target.passwordConfirm.value || ""
        }
        const JSONdata = JSON.stringify(data)

        // Regex string for username validation
        const usernameRegex = /^[a-z0-9]+(?:[-._][a-z0-9]+)*$/g

        // Check if credentials are valid
        if (usernameRegex.test(data.username) && data.username.length >= 4 && data.username.length <= 32 && data.password !== "" && data.password === data.passwordConfirm && data.password.length >= 8) {
            
            fetch("/api/signup", { method: "POST", body: JSONdata })
                .then((res) => res.text())
                .then((token) => {

                    if (token != 409) {
                        
                        // Remove any old tokens
                        removeCookie("token")

                        // Set token
                        setCookie("token", token)

                        // Unlock form
                        setSentRequest(false)

                        // Go to the dashboard
                        router.push("/dashboard")

                    } else {

                        // Alert user that username is already taken & unlock form
                        showInvalidCred("Username already taken.")
                        setSentRequest(false)

                        // Disable invalid banner after 3 seconds
                        setTimeout(() => {
                            showInvalidCred("")
                        }, 3000)
                    }

                }
            )

        } else if (data.username.length < 4) {

            // Alert user that username is too short
            showInvalidCred("Username is too short.")
            setSentRequest(false)

            // Disable invalid banner after 3 seconds
            setTimeout(() => {
                showInvalidCred("")
            }, 3000)
        
        } else if (data.username.length > 32) {

            // Alert user that username is too long
            showInvalidCred("Username is too long.")
            setSentRequest(false)

            // Disable invalid banner after 3 seconds
            setTimeout(() => {
                showInvalidCred("")
            }, 3000)

        } else if (data.password !== data.passwordConfirm) {

            // Alert user that passwords do not match & unlock form
            showInvalidCred("Passwords do not match.")
            setSentRequest(false)

            // Disable invalid banner after 3 seconds
            setTimeout(() => {
                showInvalidCred("")
            }, 3000)
        
        } else if (data.password === "" || data.passwordConfirm === "") {
            
            // Alert user that they haven't filled out both fields
            showInvalidCred("Please fill out both password fields.")
            setSentRequest(false)

            // Disable invalid banner after 3 seconds
            setTimeout(() => {
                showInvalidCred("")
            }, 3000)

        } else if (data.password.length < 8) {
            
            // Alert user that their password isn't long enough
            showInvalidCred("Please ensure that your password is at least 8 characters long.")
            setSentRequest(false)

            // Disable invalid banner after 3 seconds
            setTimeout(() => {
                showInvalidCred("")
            }, 3000)
            
        } else if (!usernameRegex.test(data.username)) {

            // Alert user that username contains invalid characters
            showInvalidCred("Username contains invalid characters.")
            setSentRequest(false)

            // Disable invalid banner after 3 seconds
            setTimeout(() => {
                showInvalidCred("")
            }, 3000)

        }
    }

    // Sign up page
    return (
        <>
            <Head>
                <title>Sign Up - Cardify</title>
            </Head>

            <div className={styles.main}>
                <div className={InvalidCred !== "" ? styles.invalid : styles.invalid + " hidden"} onClick={() => showInvalidCred("")}>
                    <p>{InvalidCred}</p>
                </div>

                <div className={styles.wrapper}>

                    <div className={styles.logoWrapper}>
                        <img src="/logo.png" />
                        <p>Cardify</p>
                    </div>

                    <form onSubmit={signup}>
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

                            <label htmlFor="passwordConfirm" className={styles.label}>Confirm Password</label>
                            <input
                                type="password"
                                name="passwordConfirm"
                                id="passwordConfirm"
                                className={styles.input}
                                required
                            />

                            <div>
                                <Link href="/login">Login</Link>

                                <button
                                    type="submit"
                                    className={ SentRequest ? styles.submit + " " + styles.submitLoading : styles.submit }
                                >Sign Up</button>
                            </div>

                        </fieldset>
                    </form>
                </div>
            </div>
        </>
    )
}