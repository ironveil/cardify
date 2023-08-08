// --- Login API Route ---

// Import hashing module
import bcrypt from "bcrypt"

// Import Prisma DB
import prisma from "../../../lib/prisma"

// Import UUID generator
import shortUUID from "short-uuid"

// /api/login/login
export default function handler(req, res) {

    // Get data
    const data = JSON.parse(req.body)

    // Try and find the user in the DB
    prisma.user.findFirst({
        where: {
            username: data.username
        },
        select: {
            password: true
        }
    }).then((result) => {

        // Gets the password, if it exists
        let dbPass

        try {
            dbPass = result.password    
        } catch {
            dbPass = ""
        }

        // Compares password with the DB one
        const correct = bcrypt.compareSync(data.password, dbPass)
        
        // If they match...
        if (correct) {

            // Generate a token
            const token = shortUUID.generate()

            // Add the token to the database
            prisma.user.update({
                where: {
                    username: data.username
                },
                data: {
                    tokens: {
                        create: {
                            id: token
                        }
                    }
                }
            }).then(() => {

                // Send the token to the user
                res.send(token)
            })

        // If they don't match...
        } else {
            res.send(false)
        }
    })
}