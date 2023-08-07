// --- Global Page ---

// Import cookies
import { CookiesProvider } from "react-cookie"

// Import global styling
import "./app.scss"

// Global page wrapper
export default function Cardify({ Component, pageProps }) {

    // Return rendered component
    return (
        <CookiesProvider>
            <Component {...pageProps} />
        </CookiesProvider>
    )
}