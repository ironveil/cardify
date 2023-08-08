// --- Sign Up API Route ---

// Import hashing module
import bcrypt from "bcrypt"

// Import Prisma DB
import prisma from "../../../lib/prisma"

// Import UUID generator
import shortUUID from "short-uuid"

// /api/login/signup
export default function handler(req, res) {

    // Get data
    const data = JSON.parse(req.body)

    // Generate hashed password
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(data.password, salt)

    // Find if the username exists
    prisma.user.findFirst({
        where: {
            username: data.username
        }
    }).then((response) => {

        // If the username already exists...
        if (response !== null) {
            res.send("false")

        // If not...
        } else {

            // Generate a token
            const token = shortUUID.generate()

            // Create the user w/ token
            prisma.user.create({
                data: {
                    username: data.username,
                    password: hashedPassword,
                    
                    tokens: {
                        create: {
                            id: token
                        }
                    },
                    groups: {},
                    decks: {},
                    cards: {}
                }
            }).then(() => {

                // Send the token to the user
                res.send(token)

            })
        }
    })
}