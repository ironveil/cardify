// --- New Deck ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/decks/new?name=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const data = JSON.parse(req.body)
    const deckName = data.name
    const groupId = parseInt(req.query.group)

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

            // Create deck
            prisma.deck.create({

                data: {
                    name: deckName,
                    userId: userId,
                    groupId: groupId
                }
                
            }).then((deck) => {

                // Send back the new deck data
                res.send(deck)

            })
        })
    }
}