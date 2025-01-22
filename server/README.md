# Test-expressJS-api-node

> RESTful API with Domain Driven Design

# DIR Structure

```
server/
├── config
│   └── environments
├── media
├── public
│   ├── docs
│   └── media
│       ├── employerField
│       └── sampleFile
├── scripts
├── src
│   ├── app
│   │   └── bureau
│   ├── domain
│   │   └── bureau
│   ├── infra
│   │   ├── azureStorage
│   │   ├── database
│   │   │   └── models
│   │   ├── encryption
│   │   ├── jwt
│   │   ├── logging
│   │   ├── repositories
│   │   │   ├── bureau
│   │   │   └── user
│   │   ├── sendgrid
│   │   ├── serializer
│   │   ├── storage
│   │   └── utils
│   └── interfaces
│       └── http
│           ├── middlewares
│           ├── modules
│           │   ├── auth
│           │   └── bureau
│           └── utils
└── test
    ├── support
    └── unit
        └── interface
            └── bureau
```
## Setting Up the Development Environment

1. Ensure you have `nvm` installed, with either node `v18.13.0` or the LTS version.
2. Install `nvm` for node version management.
3. Install the desired Node version using `nvm install v18.13.0`.
4. Set the default Node version to `18.13.0` with `nvm alias default 18.13.0`, then activate it with `nvm use`.
5. Install `yarn` globally: `npm install -g yarn`.
6. Utilize a smart `.npmrc` to ensure dependencies are saved to `package.json`.
7. Use either `yarn install` or `npm install` to install all dependencies.

### Note:

If encountering installation issues with `bcrypt`, ensure [node-gyp](https://github.com/nodejs/node-gyp) is installed first.
In case of compatibility issues after updating Node version:

1. Check for running `pm2` processes with `pm2 list` and terminate them if any.
2. Rebuild `bcrypt` with `npm rebuild bcrypt --update-binary`.

## Quick Start

### Application Setup (Development)

```sh
$ npm install -g standard   # JavaScript Standard Style
$ npm install -g babel-eslint  # required by StandardJs
$ npm install -g snazzy   # Format JavaScript Standard Style as beautiful output
$ npm install mongoose # CLI for mongoose
$ npm install mongoose @types/mongoose # CLI for mongoose
```
1. Install dependencies with [Yarn](https://yarnpkg.com/en/docs/install/) (`yarn install` or `npm install`).
2. Create the development and test databases.

### Database Setup (Development)

1. Install [MongoDB](https://www.mongodb.com/).
2. Set up MongoDB locally or use a cloud service provider.
3. No manual database creation is needed for MongoDB; it will be created automatically.
4. Rename the `.env` file and fill in the correct credentials and settings for your MongoDB database.

**Note**: Run the following commands only for development.

- `yarn createSuperUser` to create a superuser (Admin).
1. Run the application in development mode with `yarn start:dev`.
2. Access `http://localhost:<PORT>/api/<VERSION>` to get started (`http://localhost:4000/api/v1`).
3. To run test cases, use `yarn test`.
4. To build `tsc`

## Static Files

- Static files are stored in the public directory.
- Create a `media/` directory within the public directory.

## Overview

- Utilizes Node.js > v9
- Written using ES6
- Uses Yarn for package dependency management
- Adheres to [JavaScript Standard Style](http://standardjs.com/)
- Easily adaptable to different ORM and migration tools.
- Filename convention: Avoid `camelCase`, prefer `snake_case` or `kebab-case`.


## Features

### Bureau Management Features

- **Adding Bureau:** Administrators have the privilege to add new bureaus as needed, ensuring the system reflects the organizational structure accurately.
- **Management of Bureau Listings:** Comprehensive bureau listing management allows administrators to efficiently navigate and organize bureaus. Features include filtering options and pagination for easy access to bureau information.
- **Editing Bureau Details:** Administrators can modify the details of existing bureaus, updating information such as name, description, and associated roles.
- **Deletion of Bureau:** Administrators possess the authority to delete bureaus when necessary, ensuring data integrity and organizational relevance.
- **Uploading Master CSV File:** Administrators can upload a master CSV file containing bureau data, facilitating bulk data entry or updates for streamlined management.

## Technologies Used

- **React.js**: Frontend framework for building the user interface, providing a responsive and intuitive user experience.
- **Node.js Backend**: Backend environment for handling server-side logic and database operations, ensuring efficient data management and retrieval.
- **React Router**: Handling routing and navigation within the application, enabling seamless transitions between different views.
- **CSS Modules**: Styling for better organization and maintainability, ensuring a consistent and visually appealing user interface.

  
## Using Mongoose

This project utilizes MongoDB as its database management system and Mongoose as the Object Data Modeling (ODM) library for MongoDB and Node.js.

Mongoose is used to define mappings between models and database tables. It automatically adds attributes `created_at` and `updated_at` to the tables created. However, for consistency with our naming convention, these are changed to `createdAt` and `updatedAt`. To address this, include the following configuration:

```typescript
import mongoose, { Schema, Document, Model } from 'mongoose';

interface IUser extends Document {
  // Define user schema attributes here
}

const userSchema: Schema<IUser> = new Schema<IUser>({
  // Define user schema attributes here
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } // Rename timestamps
});

const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default User;
```

### Mongoose Documentation

For reference, see [Mongoose Documentation](https://mongoosejs.com/docs/guide.html).

## Testing

In the root (`mern-stack`) directory, run:

```bash
npm run test
```

**Testing frameworks**:

- Server: [mocha](https://mochajs.org/) - [chai](https://www.chaijs.com/) - [supertest](https://github.com/visionmedia/supertest)

### Version
1.0.0