// --- Get Group From Deck ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/decks/getGroup?deck=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const deckId = req.query.deck

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

        }).then((result) => (parseInt(result.userId)))
        .then((userId) => {

            // Find the specific deck
            prisma.deck.findFirst({

                where: {
                    userId: userId,
                    id: parseInt(deckId)
                },
                select: {
                    groupId: true
                }

            }).then((groupId) => groupId.groupId)
            .then((groupId) => {

                // Find the group attached to the deck
                prisma.group.findFirst({
                    
                    where: {
                        userId: userId,
                        id: groupId
                    }

                }).then((info) => {

                    // Send the result bacak
                    res.send(info)

                })
            })
        })
    }
}