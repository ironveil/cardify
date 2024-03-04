// --- Login User ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// Import hashing module
import bcrypt from "bcrypt"

// Import UUID generator
import shortUUID from "short-uuid"

// /api/login
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

    }).then((res) => {

        // Gets the password, if it exists
        let dbPass

        try {
            dbPass = res.password
        } catch {
            dbPass = ""
        }

        // Compares password with the DB one
        const correct = bcrypt.compareSync(data.password, dbPass)
        
        // If they match...
        if (correct) {

            // ...generate a token
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

        // If they don't match
        } else {

            res.send(401)

        }
    })
}