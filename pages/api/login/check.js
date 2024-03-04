// --- Check User Login  ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// /api/login/check 
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // If no token, return 401
    if (token == "undefined") {

        res.send(401)

    } else {
        
        // Try and find the token in the DB
        prisma.token.findFirst({

            where: {
                id: token
            }

        }).then((data) => {

            // Send if the token is in the database or not
            res.send(data !== null)

        })
    }
}