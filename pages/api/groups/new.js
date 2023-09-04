// --- New Group ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/groups/new
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // Get data
    const data = JSON.parse(req.body)
    const groupName = data.name

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

            // Create group
            try {
                prisma.group.create({

                    data: {
                        name: groupName,
                        userId: userId
                    }

                }).then((groupResult) => {

                    // Send back the new group data
                    res.send(groupResult)

                })

            // Return false if error
            } catch {
                res.send("false")
            }
        })
    }
}