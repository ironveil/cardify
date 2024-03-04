// --- Delete Card ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/card/delete?card=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const cardId = parseInt(req.query.card)

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

            // Delete card
            prisma.card.deleteMany({

                where: {
                    id: cardId,
                    userId: userId,
                }

            }).then((res) => {

                // Return if successful
                res.send(res !== null)

            })
        })
    }
}