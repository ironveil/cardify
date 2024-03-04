// --- Get Current Decks ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/decks/get?group=&?deck=
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

            // Get wanted group or deck
            var groupId = req.query.group
            var deckId = req.query.deck

            // Find all the decks belonging to that user
            if (groupId == "all") {

                prisma.deck.findMany({
                    where: {
                        userId: userId
                    }

                }).then((decks) => {

                    // Send them back
                    res.send(decks)
                })

            // Find specific deck
            } else if (groupId != undefined) {

                // Turn ID into integer
                groupId = parseInt(groupId)

                // Find all decks belonging to that group
                prisma.deck.findMany({

                    where: {
                        userId: userId,
                        groupId: groupId
                    }
                    
                }).then((decks) => {

                    // Send them back
                    res.send(decks)

                })
            } else if (deckId) {

                // Turn ID into integer
                deckId = parseInt(deckId)

                // Find the specified deck
                prisma.deck.findFirst({

                    where: {
                        userId: userId,
                        id: deckId
                    }

                }).then((deck) => {

                    // Send it back
                    res.send(deck)
                    
                })
            }
        })
    }
}