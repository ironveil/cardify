// --- Get Current Cards ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/cards/get?deck=&card=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

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

            // Get wanted deck
            const deckId = parseInt(req.query.deck)

            // Find a specific card
            if (req.query.card != undefined) {

                prisma.card.findMany({

                    where: {
                        id: parseInt(req.query.card),
                        userId: userId,
                        deckId: deckId
                    }
                    
                }).then((card) => {

                    // Send the specific card back
                    res.send(card[0])

                })

            } else {

                // Find all the cards
                prisma.card.findMany({

                    where: {
                        userId: userId,
                        deckId: deckId
                    }
                    
                }).then((cards) => {
                    
                    // Send them back
                    res.send(cards)
                })
            }
        })
    }
}