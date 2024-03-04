// --- Remove Existing Login ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/login/remove 
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // If no token, return 401
    if (token == "undefined") {

        res.send(401)

    } else {

        // Try and delete the token
        prisma.token.delete({
            
            where: {
                id: token
            }

        }).then((data) => {

            // Return if successful
            res.send(data !== null)

        })
    }
}