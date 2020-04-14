# CS2102 Backend

### Requirements

1. Install `docker` and `docker-compose`
2. Install `yarn`
3. Install Postman (Optional, but useful for querying)

### Quickstart

1. Download the queries [here](https://www.getpostman.com/collections/4e0f7e8fcc9132718633) for Postman. Import the queries into Postman, and in the imported folder, click on Edit, and go to the Variables tab. Key in the initial value and current value of BASE_API_URL to be `localhost:3000`.
2. `git clone` this repository
3. `cd` into this folder
4. Run `./install.sh` to install the dependencies for both the backend and the frontend.
5. `docker-compose up` (with `sudo` if necessary) to run the containers
6. When all the services have started, the last message should show something like `Server running at http://localhost:1234`, which is the URL of the frontend.
7. If this is the first time running the docker containers, do a `GET http://localhost:3000/seed` request to seed the initial database while the containers are running. The seeding of the database is complete when the console shows `Seeding complete!`. An account for each user type will also be logged in the console for easy access.
8. There are 4 user types: Manager, Rider, Customer, and Restaurant. All of them log in using a username and password. To log in to any one of these accounts, follow the instructions belowe.
9. Stopping the process is as simple as inputting `Ctrl+C` in the console that is running the docker services.

### Logging In

There is an account for each user type that has a fixed username and password. All passwords are `password`.

Manager: `adam0`

Customer: `bob10`

Delivery Rider: `carol510`

Restaurant: `david610`
