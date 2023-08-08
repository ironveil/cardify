// --- Global Page ---

// Import cookies
import { CookiesProvider } from "react-cookie"

// Import global styling
import "./app.scss"
import Head from "next/head"

// Global page wrapper
export default function Cardify({ Component, pageProps }) {

    // Return rendered component
    return (
        <>
            <Head>
                <title>Cardify</title>
            </Head>

            <CookiesProvider>
                <Component {...pageProps} />
            </CookiesProvider>
        </>
    )
}