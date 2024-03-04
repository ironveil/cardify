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

    // If no token, return 401
    if (token == "undefined") {

        res.send(401)

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

            }).then((deck) => {

                // Send it back
                res.send(deck)

            })
        })
    }
}