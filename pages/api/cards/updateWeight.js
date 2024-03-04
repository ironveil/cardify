// --- Update Card Weight ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/cards/updateWeight?card=&remembered=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const id = parseInt(req.query.card)
    const remembered = parseInt(req.query.remembered)

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

            // Get current weight
            prisma.card.findFirst({

                where: {
                    id: id,
                    userId: userId
                },
                select: {
                    weight: true
                }

            }).then((result) => (result.weight))
            .then((calcWeight) => (calcWeight = calcWeight + 1 + remembered))
            .then((weight) => {

                // Update the card with the new weight
                prisma.card.update({
                
                    where: {
                        id: id,
                        userId: userId,
                    },
                    data: {
                        weight: weight
                    }

                }).then((updatedCard) => {

                    // Send the result back
                    res.send(updatedCard)
                    
                })
            })
        })
    }
}