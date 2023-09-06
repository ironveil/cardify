// --- Get Current Decks ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/decks/get?group= or ?deck=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // If no token, return false
    if (token == "undefined") {

        res.send("false")

    } else {

        // Find the user attached to the token
        prisma.token.findFirst({

            where: {
                id: token
            },
            select: {
                userId: true
            }

        }).then((result) => (result.userId))
        .then((userId) => {

            // Get wanted group or deck
            let groupId = req.query.group
            let deckId = req.query.deck

            // Find all the decks belonging to that user
            if (groupId === "all") {

                prisma.deck.findMany({
                    where: {
                        userId: userId
                    }

                }).then((decks) => {

                    // Send them back
                    res.send(decks)
                })

            // Find specific deck
            } else if (groupId != undefined) {

                // Turn ID into integer
                groupId = parseInt(groupId)

                // Gind all decks belonging to that group
                prisma.deck.findMany({

                    where: {
                        userId: userId,
                        groupId: groupId
                    }
                    
                }).then((decks) => {

                    // Send them back
                    res.send(decks)

                })
            } else if (deckId) {

                deckId = parseInt(deckId)

                prisma.deck.findFirst({

                    where: {
                        userId: userId,
                        id: deckId
                    }

                }).then((deck) => {

                    res.send(deck)
                    
                })

            }
        })
    }
}