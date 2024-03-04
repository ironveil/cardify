// --- Get All Groups ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/groups/get
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

        }).then((res) => (res.userId))
        .then((userId) => {

            // Find all the groups belonging to that user
            prisma.group.findMany({

                where: {
                    userId: userId
                }
                
            }).then((groups) => {

                // Send them back
                res.send(groups)
                
            })
        })
    }
}