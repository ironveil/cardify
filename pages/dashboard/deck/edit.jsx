// --- Flashcards Editor ---

// Import modules
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import Link from "next/link"
import useSWR from 'swr'
import { useQueryState } from "next-usequerystate"

// Import styling
import styles from "./edit.module.scss"
import { LuHome, LuPlusCircle } from "react-icons/lu"

// API fetcher
const fetcher = (url, token) => fetch(url, { headers: { "Authorization": token } }).then((res) => res.json())

// Edit page
export default function Edit() {

    // Get the token from cookies
    const [ cookies ] = useCookies()
    const token = cookies.token    

    // Allow page navigation
    const router = useRouter()

    // Check login
    const loginUrl = "/api/login/check"
    const { data: validToken, isLoading: loadingToken, mutate: reloadCards } = useSWR([ loginUrl, token ], () => fetcher(loginUrl, token))

    // Get current deck
    const deck = router.query.deck

    // Check if token is invalid
    if (validToken == false) {

        // Tell the client to redirect to the login page
        router.push("/login")

    // If token is valid
    } else if (loadingToken == false) {
        
        // Render the main page
        return (

            <div className={styles.main}>

                <EditNavbar
                    deck={deck}
                    token={token} />
                    
                <EditContent
                    deck={deck}
                    router={router}
                    token={token} />
            </div>

        )  
    }
}

// Top navbar
function EditNavbar({ deck, token }) {

    // Get deck data
    const deckUrl = "/api/decks/get?deck=" + deck
    const { data, isLoading } = useSWR([deckUrl, token], () => fetcher(deckUrl, token))

    // Return the content
    if (!isLoading) {

        // Render the navbar
        return (
            <div className={styles.navbar}>
                <Link href={"/dashboard?group=" + data.groupId}>Back</Link>
            </div>
        )
    }
}

// Main content
function EditContent({ deck, router, token }) {

    // Get card data
    const cardUrl = "/api/cards/get?deck=" + deck
    const { data, isLoading } = useSWR([cardUrl, token], () => fetcher(cardUrl, token))

    // Set the current card
    const [ currentCard, setCurrentCard ] = useQueryState("card")

    // Get the card data from array
    function getCardData(id) {

        // Find the card within the array
        let cardData = data.find( c => c.id == id )

        // Return needed variables
        return [ cardData.front, cardData.back ]
    }

    // Create a new card
    function createCard(e) {
        e.preventDefault()

        // Get the form data
        const data = { front: e.target.front.value || "", back: e.target.back.value || "" }
        const JSONdata = JSON.stringify(data)

        // Get the wanted deck
        const wantedDeck = router.query.deck

        // Create the card
        fetch("/api/cards/new?deck=" + wantedDeck, { method: "POST", body: JSONdata, headers: { "Authorization": token } })
        .then((res) => res.json())
        .then(() => {

            // Refresh the page
            router.reload()

        })
    }

    // Render the main content if the content has been fetched
    if (!isLoading) {

        return (
            <div className="content">

                <div className={styles.list}>

                    <div className={styles.dual}>

                        <div onClick={() => setCurrentCard(null)}
                             className={styles.card}>

                            <LuHome size={32} />

                        </div>

                        <div onClick={() => setCurrentCard("new")}
                             className={styles.card}>

                            <LuPlusCircle size={32} />

                        </div>
                    </div>

                    { data.map((card) => (

                        <div key={card.id}
                             onClick={() => setCurrentCard(card.id)}
                             className={router.query.card == card.id ? styles.card + " " + styles.currentCard : styles.card}>

                            <p>{card.front}</p>

                        </div>
                    ))}

                </div>

                <div>

                    { currentCard === null && (
                        <div>

                            <p>Home</p>

                        </div>
                    )}
                    { currentCard == "new" && (
                        <div>

                            <p>New</p>

                            <form onSubmit={createCard}>

                                <input id="front" name="front" type="text" />

                                <input id="back" name="back" type="text" />

                                <input type="submit" value="Create" />

                            </form>

                        </div>
                    )}
                    { ( currentCard != "new" && currentCard != null) && (
                        <div>

                            <form>

                                <input id="front" name="front" type="text" value={getCardData(currentCard)[0]} onChange={(e) => {}} />

                                <input id="back" name="back" type="text" value={getCardData(currentCard)[1]} />

                                <input type="submit" value="Edit" />

                            </form>

                        </div>
                    )}
                    
                </div>
            </div>
        )
    }
}