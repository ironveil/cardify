// --- Check Login API Route ---

// Import Prisma DB
import prisma from "../../lib/prisma"

// /api/checklogin
export default function handler(req, res) {

    // Get token from header
    let token = req.headers.authorization

    // If no token, return 401 error
    if (token == "undefined") {

        res.send(401)

    } else {
        
        // Try and find the token in the DB
        try {
            prisma.token.findFirst({
                where: {
                    id: token
                }
            }).then((data) => {

                // Send if the token is in the database or not
                res.send(data !== null)

            })
        } catch {

            // If there is an error, send 'false'
            res.send(false)

        }
    }
}