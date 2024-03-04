// --- Signup New User ---

// Import Prisma DB
import prisma from "../../../lib/prisma"

// Import hashing module
import bcrypt from "bcrypt"

// Import UUID generator
import shortUUID from "short-uuid"

// /api/signup
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

    }).then((res) => {

        // If the username already exists
        if (res !== null) {

            // Send back 409
            res.send(409)

        // If it doesn't exist
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