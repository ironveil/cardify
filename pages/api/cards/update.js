// --- Update Card Info ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/cards/update?card=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const data = JSON.parse(req.body)
    const cardFront = data.front
    const cardBack = data.back
    const cardId = parseInt(req.query.card)

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

            // Update the specific card
            prisma.card.update({

                where: {
                    userId: userId,
                    id: cardId
                },
                data: {
                    front: cardFront,
                    back: cardBack
                }

            }).then((result) => {

                // Send the result back
                res.send(result)

            })
        })
    }
}