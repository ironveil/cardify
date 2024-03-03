// --- Deck List Component ---

// Import modules
import Link from "next/link"

// Import styling
import styles from "./DeckList.module.scss"
import { LuPlusCircle } from "react-icons/lu"

// Deck List
export default function DeckList({ decks, current }) {

    // Return if there are decks available
    if (current != "all" || decks.length != 0) {

        return (
            <div className={styles.list}>

                {decks.map((deck) => (
                    
                    <DeckItem key={deck.id} deck={deck} /> )
                
                )}

                { current !== "all" && (

                    <Link className={styles.deck + " " + styles.new}
                    href={"/dashboard/new?item=deck&group=" + current}>

                        <LuPlusCircle />

                    </Link>

                )}

            </div>
        )

    // Return if no decks on homepage
    } else {
        
        return (

            <div className={styles.center}>
                <p>No flashcard decks.</p>
            </div>
            
        )
    }
}

// Individual deck item
export function DeckItem({ deck }) {

    return (
        <div className={styles.deck}>

            <div className={styles.title}>
                <p>{deck.name}</p>
            </div>

            <div className={styles.buttons}>
                <Link href={"/dashboard/deck/edit?deck=" + deck.id}>Edit</Link>
                <Link href={"/dashboard/deck/revise?deck=" + deck.id}>Revise</Link>
            </div>

        </div>
    )
}