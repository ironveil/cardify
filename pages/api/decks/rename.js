// --- Rename Deck ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/decks/rename?deck=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const data = JSON.parse(req.body)
    const deckName = data.name
    const deckId = parseInt(req.query.deck)

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

            // Update the specific deck
            prisma.deck.update({

                where: {
                    userId: userId,
                    id: deckId
                },
                data: {
                    name: deckName
                }

            }).then((result) => {

                // Send the result back
                res.send(result)

            })
        })
    }
}