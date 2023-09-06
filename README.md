# Cardify
Cardify is a free & open-source flashcards website.

## How to run

### Docker
1. Clone the Git repository
2. Create an .env file
3. Within the .env file, add a key called `DATABASE_URL` with the following value: `mysql://root:[root password]@[url]:[port]/[database]`
4. Run `docker build .` *(optionally, specify a tag using `-t [tag]`)*.
5. Set up a MySQL server with the same root password as before.
6. Run the cardify Docker container.