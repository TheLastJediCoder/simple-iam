# Simple IAM

## Description

A simple identity and access management

## Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/TheLastJediCoder/simple-iam.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd simple-iam
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up environment variables**:  
   Create a `.env` file in the root directory and add the required variables. Example:

   ```text
   PORT=3020
   DATABASE_URL="mysql://root:password@localhost:3306/simple_iam"
   ```

5. **Prisma Usage**:
   - Create a migration:

     ```bash
     npx prisma migrate dev --name <name_of_migration>
     ```

   - Apply migrations:

     ```bash
     npx prisma migrate deploy
     ```

   - Generate the Prisma Client:

     ```bash
     npx prisma generate
     ```

6. **Prerequisites**:

   - The database is set up and migrated using Prisma:
      1. Configure the database connection in the .env file (see Set Up Environment Variables).
      2. Run the following command to apply the already created migrations:

         ```bash
         npx prisma migrate deploy
         ```
  
         This will apply the existing database schema.

      3. The database is running and accessible.
      4. All required environment variables are configured in the .env file.

7. **Run the project**:
   - Development mode:

     ```bash
     npm run dev
     ```

   - Production mode:

     ```bash
     npm start
     ```
