// --- Get Current Decks ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/decks/get
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

            // Get wanted group
            let groupId = req.query.group

            // Find all the decks belonging to that user
            if (groupId === "all") {

                prisma.deck.findMany({
                    where: {
                        userId: userId
                    }

                }).then((decks) => {

                    // Send them back
                    res.send(decks)
                })

            // Find specific deck
            } else {

                // Turn ID into integer
                groupId = parseInt(groupId)

                // Gind all decks belonging to that group
                prisma.deck.findMany({

                    where: {
                        userId: userId,
                        groupId: groupId
                    }
                    
                }).then((decks) => {

                    // Send them back
                    res.send(decks)
                })
            }
        })
    }
}