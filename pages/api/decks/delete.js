// --- Delete Deck ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/decks/delete?deck=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
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

        })
        .then((res) => parseInt(res.userId))
        .then((userId) => {

            // Delete cards
            prisma.card.deleteMany({

                where: {
                    userId: userId,
                    deckId: deckId
                }

            }).then(() => {

                // Delete decks
                prisma.deck.deleteMany({

                    where: {
                        id: deckId,
                        userId: userId,
                    }

                }).then((res) => {

                    // Return if successful
                    res.send(res !== null)

                })
            })

        })
    }
}