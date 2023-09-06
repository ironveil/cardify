// --- Get Current Cards ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/cards/get?deck=
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

            // Get wanted deck
            let deckId = parseInt(req.query.deck)

            // Gind all cards belonging to that deck
            prisma.card.findMany({

                where: {
                    userId: userId,
                    deckId: deckId
                }
                
            }).then((cards) => {

                // Send them back
                res.send(cards)

            })
        })
    }
}