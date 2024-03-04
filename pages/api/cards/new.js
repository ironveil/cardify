// --- New Card ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/cards/new?deck=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const data = JSON.parse(req.body)
    const cardFront = data.front
    const cardBack = data.back
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

        }).then((res) => (res.userId))
        .then((userId) => {

            // Find the group associated with the deck
            prisma.deck.findFirst({

                where: {
                    id: deckId
                },
                select: {
                    groupId: true
                }

            }).then((res) => (res.groupId))
            .then((groupId) => {

                // Create the new card
                prisma.card.create({

                    data: {
                        userId: userId,
                        groupId: groupId,
                        deckId: deckId,

                        front: cardFront,
                        back: cardBack,
                        weight: 1
                    }
                    
                }).then((cardResult) => {

                    // Send back the new card data
                    res.send(cardResult)

                })
            })
        })
    }
}