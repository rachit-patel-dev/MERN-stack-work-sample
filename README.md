# MERN-stack Mono-Repo sample
![M](./media/mongo.png) ![E](./media/express.png) ![R](./media/react.png) ![N](./media/node.png)

Welcome to the MERN Stack Mono-Repo Project! This project utilizes the MERN (MongoDB, Express.js, React.js, Node.js) stack to create a full-stack web application for managing bureaus. Below you'll find a detailed overview of the project structure, technologies used, and features implemented.

## Project Structure

```
MERN-STACK-SAMPLE/
├── client
│   └── frontend stuff
└── server
    └── backend stuff
```

- **[client](./client/README.md)**: Contains frontend code written in React.js.
- **[server](./server/README.md)**: Contains backend code written in Node.js using Express.js with Mongo DB.

## Detailed Description

The MERN stack is a popular technology stack for building modern web applications. It comprises four main technologies:

- **MongoDB**: A NoSQL database that stores data in flexible, JSON-like documents.
- **Express.js**: A web application framework for Node.js, providing a robust set of features for building web and mobile applications.
- **React.js**: A JavaScript library for building user interfaces, developed by Facebook. It allows developers to create reusable UI components.
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine. It allows developers to run JavaScript code on the server-side.

Additionally, Mongoose is used with MongoDB to provide a schema-based solution to model application data. It includes built-in type casting, validation, query building, and business logic hooks.

## Features of this project

### Bureau Management Features

- **Adding Bureau:** Administrators have the privilege to add new bureaus as needed, ensuring the system reflects the organizational structure accurately.
- **Management of Bureau Listings:** Comprehensive bureau listing management allows administrators to efficiently navigate and organize bureaus. Features include filtering options and pagination for easy access to bureau information.
- **Editing Bureau Details:** Administrators can modify the details of existing bureaus, updating information such as name, description, and associated roles.
- **Deletion of Bureau:** Administrators possess the authority to delete bureaus when necessary, ensuring data integrity and organizational relevance.
- **Uploading Master CSV File:** Administrators can upload a master CSV file containing bureau data, facilitating bulk data entry or updates for streamlined management.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the `client` directory and install dependencies: `cd client && npm install`
3. Navigate to the `server` directory and install dependencies: `cd ../server && npm install`
4. Start the server: `npm start` (in the `server` directory)
5. Start the client: `npm start` (in the `client` directory)
6. Open your browser and navigate to `http://localhost:3000` to view the application.

## Contribution

Contributions are welcome! If you'd like to contribute to this project, please follow these guidelines:

- Fork the repository
- Create a new branch (`git checkout -b feature/new-feature`)
- Make your changes and commit them (`git commit -am 'Add new feature'`)
- Push your changes to the branch (`git push origin feature/new-feature`)
- Create a pull request

## License

This project is licensed under the [MIT License](./LICENSE).
