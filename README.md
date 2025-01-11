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
   DATABASE_HOST=localhost
   DATABASE_PORT=3306
   DATABASE_USER=root
   DATABASE_PASSWORD=password
   DATABASE_NAME=simple_iam
   ```

5. **Run the project**:
   - Development mode:

     ```bash
     npm run dev
     ```

   - Production mode:

     ```bash
     npm start
     ```
