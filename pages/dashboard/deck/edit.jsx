// --- Flashcards Editor ---

// Import modules
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import Link from "next/link"
import useSWR from 'swr'
import { useEffect, useState } from "react"

// Import styling
import styles from "./edit.module.scss"
import { LuHome, LuPlusCircle, LuTrash2 } from "react-icons/lu"

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
    const { data: validToken, isLoading: loadingToken } = useSWR([ loginUrl, token ], () => fetcher(loginUrl, token))

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

        // Prevent error if undefined data is retrieved
        var backlink

        try {
            backlink = "/dashboard?group=" + data.groupId
        } catch (e) {
            backlink = "/dashboard"
        }

        // Render the navbar
        return (
            <div className={styles.navbar}>
                <Link href={backlink}>Back</Link>
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
    const [ currentCard, setCurrentCard ] = useState(null)

    // Get deck data
    const deckUrl = "/api/decks/get?deck=" + deck
    const { data: deckData, isLoading: deckLoading } = useSWR([deckUrl, token], () => fetcher(deckUrl, token))
    
    // Set the current deck name
    const [ currentDeckName, setCurrentDeckName ] = useState("")

    // Set the deck name once the page is loaded
    useEffect(() => {

        // Wait for it to load
        if (deckData !== undefined) {
            setCurrentDeckName(deckData.name)
        }

    }, [deckLoading])

    // Get the card data from array
    function getCardData(id) {

        // Find the card within the array
        let cardData = data.find( c => c.id == id )

        // Return needed variables
        try {

            return [ cardData.front, cardData.back ]

        } catch (e) {

            return [ false, false ]
        }
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

    // Rename a deck
    function renameDeck(e) {
        e.preventDefault()

        // Get the form data
        const data = { name: e.target.name.value || "" }
        const JSONdata = JSON.stringify(data)

        // Rename the deck
        fetch("/api/decks/rename?deck=" + deck, { method: "POST", body: JSONdata, headers: { "Authorization": token } })
        .then((res) => res.json())
        .then(() => {

            // Refresh the page
            router.reload()

        })
    }

    // Delete a deck
    function deleteDeck(e) {
        e.preventDefault()

        // Delete the deck
        fetch("/api/decks/delete?deck=" + deck, { headers: { "Authorization": token } })
        .then(() => {

            // Refresh the page
            router.push("/dashboard")

        })
    }

    // Render the main content if the content has been fetched
    if (!isLoading && !deckLoading) {

        return (
            <div className={styles.content}>

                <div className={styles.list}>

                    <div className={styles.dual}>

                        <div onClick={() => setCurrentCard(null)}
                             className={currentCard === null ? styles.card + " " + styles.currentCard : styles.card}>

                            <LuHome size={32} />

                        </div>

                        <div onClick={() => setCurrentCard("new")}
                             className={currentCard == "new" ? styles.card + " " + styles.currentCard : styles.card}>

                            <LuPlusCircle size={32} />

                        </div>
                    </div>

                    { data.map((card) => (

                        <div key={card.id}
                             onClick={() => setCurrentCard(card.id)}
                             className={currentCard == card.id ? styles.card + " " + styles.currentCard : styles.card}>

                            <p>{card.front}</p>

                        </div>
                    ))}

                </div>

                <div>

                    { currentCard === null && (
                        <div className={styles.edit}>

                            <div className={styles.header}>
                
                                <p>Home</p>

                                <button onClick={deleteDeck}>

                                    <LuTrash2 size={24} />

                                </button>

                            </div>

                            <form onSubmit={renameDeck} className={styles.home}>

                                <label htmlFor="name">Deck Name</label>
                                <input id="name"
                                       name="name"
                                       type="text"
                                       placeholder="Name"
                                       value={currentDeckName}
                                       onChange={ (e) => setCurrentDeckName(e.target.value) }
                                       required />

                                <input type="submit" value="Rename" />

                            </form>

                        </div>
                    )}
                    { currentCard == "new" && (
                        <div className={styles.edit}>

                            <div className={styles.header}>
                                
                                <p>New Flashcard</p>
                            
                            </div>

                            <form onSubmit={createCard}>

                                <input id="front"
                                       name="front"
                                       type="text"
                                       placeholder="Front"
                                       required />

                                <input id="back"
                                       name="back"
                                       type="text"
                                       placeholder="Back"
                                       required/>

                                <input type="submit" value="Create" />

                            </form>

                        </div>
                    )}
                    { ( currentCard != "new" && currentCard != null) && (
                        
                        <FlashcardEditor currentCard={currentCard}
                                         setCurrentCard={setCurrentCard}
                                         getCardData={getCardData}
                                         deck={deck}
                                         router={router}
                                         token={token} />
                    
                    )}
                    
                </div>
            </div>
        )
    }
}

// Existing flashcard editor
function FlashcardEditor({ currentCard, setCurrentCard, getCardData, deck, router, token }) {

    // Get the front & back of the flashcard
    const [ cardFront, setCardFront ] = useState("")
    const [ cardBack, setCardBack ] = useState("")

    // Only update the flashcard text when changing selection
    useEffect(() => {

        setCardFront(getCardData(currentCard)[0])
        setCardBack(getCardData(currentCard)[1])

    }, [currentCard])

    // Update an existing flashcard
    function updateCard(e) {
        e.preventDefault()

        // Get the form data
        const data = { front: e.target.front.value || "", back: e.target.back.value || "" }
        const JSONdata = JSON.stringify(data)

        // Update the card
        fetch("/api/cards/update?card=" + currentCard, { method: "POST", body: JSONdata, headers: { "Authorization": token } })
        .then((res) => res.json())
        .then(() => {

            // Refresh the page
            router.reload()

        })
    }

    // Delete an existing flashcard
    function deleteCard(e) {
        e.preventDefault()

        // Delete the card
        fetch("/api/cards/delete?card=" + currentCard, { headers: { "Authorization": token } })
        .then(() => {

            // Refresh the page
            router.reload()

        })
    }

    // Render the editor
    return (
        <div className={styles.edit}>

            <div className={styles.header}>
                
                <p>Edit Flashcard</p>

                <button onClick={deleteCard}>

                    <LuTrash2 size={24} />

                </button>

            </div>

            <form onSubmit={updateCard}>

                <input id="front"
                       name="front"
                       type="text"
                       value={cardFront}
                       onChange={(e) => { setCardFront(e.target.value) }}
                       placeholder="Front"
                       required />

                <input id="back"
                       name="back"
                       type="text"
                       value={cardBack} 
                       onChange={(e) => { setCardBack(e.target.value) }}
                       placeholder="Back"
                       required />

                <div>
                    <input type="submit" value="Edit" />
                </div>

            </form>

        </div>
    )
}