# 2FA_Authentication_NodeJS
 Implement the two factor authentication with NodeJS to enhance the security in NodeJS application. This project only crete backend using speakeeasy library. 

# Installation 
- Node.js
- MySQL or XAMMP , WAMP server you like

# Setup
1. Clone the repository
    ```bash
    git clone https://github.com/codeIndrajith/2FA_Authentication_NodeJS.git
    cd your-repo-name
    ```
2. Install Dependencies
   ```bash
     npm install
   ```
3. Configure the Database
   ```bash
     DB_HOST=your-database-host
     DB_USER=your-database-username
     DB_PASSWORD=your-database-password
     DB_NAME=your-database-name
     DB_DIALECT=mysql
   ```
4. Start the Server
   ```bash
     npm start
   ```
# API Endpoints
  - ```POST /api/user/register``` - Register user
  - ```POST /api/user/verify```   - Verify the token with speakeasy
  - ```POST /api/user/validate``` - Validate the user with speakeasy

# Database Schema 
 - User
    - `id` : Int using uuid.v4()
    - `name` : String
    - `email` : String
    - `password` : String
      
# Technologies Used
  - Node.js
  - Express.js
  - MySQL
  - Sequelize ORM













    
