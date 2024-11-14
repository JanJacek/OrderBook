# Order book
In response to the recruitment task, I developed an application that implements the functionalities outlined in the guidelines, including displaying the current state of the order list and allowing users to place orders through WebSocket integration. The application offers full sorting for all columns in the Order Book table (by clicking on the relevant column header).

The application consists of three main layers: frontend, backend, and database, and includes a simple login system with two user accounts:

Login: ala@ma.com, Password: p123
Login: kot@ma.com, Password: p123
Application Structure
Database: The database structure is defined in the Prisma files located in backend/prisma/schema.prisma. The "orders" table includes an execution date, which is essential for maintaining the First In, First Out (FIFO) rule, especially if the application is further developed.
Quick Start
Clone the repository and install dependencies:
Run yarn separately in both the frontend (fe) and backend (be) directories.
Starting the backend:
First, create the database with: yarn db:create.
Then, start the backend with: yarn start.
Starting the frontend:
In the frontend directory, run: yarn dev.
All other important commands are listed in the package.json files located in the frontend and backend folders.

Further Development
For future development stages, consider:

Refining the scope of data sent to users,
Managing order sequencing independently of user time zones.
