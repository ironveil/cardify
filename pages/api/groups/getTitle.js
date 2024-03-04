// --- Get Title of Group ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/groups/getTitle?group=
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const groupId = req.query.group

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

        }).then((result) => (parseInt(result.userId)))
        .then((userId) => {

            // If all groups wanted
            if (groupId === "all") {

                // Send generic title
                res.send({ name: "All Decks"})

            // If specific group wanted
            } else {

                // Find name of group
                prisma.group.findFirst({

                    where: {
                        userId: userId,
                        id: parseInt(groupId)
                    },
                    select: {
                        name: true
                    }

                }).then((title) => {

                    // Send the title
                    res.send(title)
                    
                })
            }
        })
    }
}