// --- Flashcards Revise ---

// Import modules
import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import Link from "next/link"
import useSWR from 'swr'
import { useMemo, useState } from "react"

// API fetcher
const fetcher = (url, token) => fetch(url, { headers: { "Authorization": token } }).then((res) => res.json())

// Revise page
export default function Revise() {

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

    const [ cardFront, setCardFront ] = useState("")
    const [ cardBack, setCardBack ] = useState("")
    const [ cardSide, setCardSide ] = useState(0)
    const [ cardId, setCardId ] = useState(0)

    // Check if token is invalid
    if (validToken == false) {

        // Tell the client to redirect to the login page
        router.push("/login")

    // If token is valid
    } else if (loadingToken == false) {
        
        // Render the main page
        return (

            <div>

                <ReviseNavbar
                    deck={deck}
                    token={token} />

                <ReviseContent
                    deck={deck}
                    cardFront={cardFront}
                    setCardFront={setCardFront}
                    cardBack={cardBack}
                    setCardBack={setCardBack}
                    cardSide={cardSide}
                    setCardSide={setCardSide}
                    cardId={cardId}
                    setCardId={setCardId}
                    router={router}
                    token={token} />

            </div>

        )
    }
}

// Top navbar
function ReviseNavbar({ deck, token }) {

    // Get deck data
    const deckUrl = "/api/decks/get?deck=" + deck
    const { data, isLoading } = useSWR([deckUrl, token], () => fetcher(deckUrl, token))

    // Return the content
    if (!isLoading) {

        // Render the navbar
        return (
            <div>
                <Link href={"/dashboard?group=" + data.groupId}>Back</Link>
                <p>Revising {data.name}</p>
            </div>
        )
    }
}

// Main content
function ReviseContent({ deck, cardFront, setCardFront, cardBack, setCardBack, cardSide, setCardSide, cardId, setCardId, router, token }) {

    // Get card data
    const weightedCardUrl = "/api/cards/getWeighted?deck=" + deck

    // Only refresh ONCE
    useMemo( () => {

        // Fetch a random weighted card
        fetch(weightedCardUrl, { headers: { "Authorization": token } })
        .then((res) => res.json())
        .then((card) => {

            // Set the card properties
            setCardFront(card.front)
            setCardBack(card.back)
            setCardId(card.id)

        })

    }, [])

    // Get the next card
    function nextCard(ifRemembered) {

        // Update the weight of the card
        const updateWeightUrl = "/api/cards/updateWeight?card=" + cardId + "&remembered=" + ifRemembered
        fetch(updateWeightUrl, { headers: { "Authorization": token } }).then(() => router.reload())

    }

    // Render the main content
    return (
        <div>

            { cardSide == 0 ? (

                <div>

                    <p>{cardFront}</p>

                </div>

            ) : (

                <div>

                    <p>{cardBack}</p>

                </div>

            )}

            <div>

                { cardSide == 1 && (
                    <button onClick={() => nextCard(0) }>Forgotten</button>
                )}

                <button onClick={() => setCardSide(cardSide == 0 ? 1 : 0)}>Flip</button>

                { cardSide == 1 && (
                    <button onClick={() => nextCard(1) }>Remembered</button>
                )}
                
            </div>
        </div>
    )
}