// --- Get Cards For Revision ---

// Import Prisma DB
import randomWeightedChoice from "random-weighted-choice"
import prisma from "../../../lib/prisma"

// /api/cards/getWeighted?deck=
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

        }).then((res) => (res.userId))
        .then((userId) => {

            // Get wanted deck
            const deckId = parseInt(req.query.deck)

            // Find all cards belonging to that deck
            prisma.card.findMany({

                where: {
                    userId: userId,
                    deckId: deckId
                }
                
            }).then((cards) => {

                // Get the card ID & matching weight
                var weightedCards = []

                cards.map((card) => {
                    weightedCards.push({ weight: card.weight, id: card.id})
                })

                // Randomly select the card with the lowest probability
                const weightedChoice = parseInt(randomWeightedChoice(weightedCards, 100))

                // Find this specific card
                prisma.card.findFirst({

                    where: {
                        id: weightedChoice,
                        userId: userId,
                        deckId: deckId
                    }

                }).then((card) => {

                    // Send the random card back
                    res.send(card)

                })
            })
        })
    }
}