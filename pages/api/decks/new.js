// --- New Deck ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/groups/new?name=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const data = JSON.parse(req.body)
    const deckName = data.name
    const groupId = parseInt(req.query.group)

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

            // Create deck
            prisma.deck.create({

                data: {
                    name: deckName,
                    userId: userId,
                    groupId: groupId
                }
                
            }).then((deckResult) => {

                // Send back the new group data
                res.send(deckResult)

            })
        })
    }
}