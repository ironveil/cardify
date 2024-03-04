// --- Delete Group ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/groups/delete?group=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
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

        })
        .then((result) => parseInt(result.userId))
        .then((userId) => {

            // Delete cards
            prisma.card.deleteMany({

                where: {
                    userId: userId,
                    groupId: groupId
                }

            }).then(() => {

                // Delete decks
                prisma.deck.deleteMany({

                    where: {
                        userId: userId,
                        groupId: groupId
                    }

                }).then(() => {

                    // Delete group
                    prisma.group.delete({

                        where: {
                            userId: userId,
                            id: groupId
                        }

                    }).then((result) => {

                        // Return if successful
                        res.send(result !== null)
                        
                    })
                })
            })

        })
    }
}