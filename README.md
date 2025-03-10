# Authentication System

This is a backend assignment comprising test cases, logger systems, security methods for complete authentication system.

-----

# 1.0 Prequisite
- Node version 22+
- MoongoDB (atlas) account
- Docker Desktop should be in your computer for Docker installation only.

-----

# 2.0 Installation

### Install the project by cloning this repo from your terminal.

- Step 1: Clone the Repo

```bash
 git clone https://github.com/abhyuday1212/Backend-Assignment.git
```

```bash
 npm i
```

- If any ERR ocured in terminal the use this command and reinstall the dependencies using this line

```bash
  npm i --force
```

### Create .env file by copying the variable names from .env.sample


### Run the backend server.

- Goto #root folder and run these commands in your powershell.

```bash
  npm start
```

- If terminal returns Port started successfully at ${PORT} & Databse connected successfully than you are good to go.


---

backend is accessible at http://localhost:8000

---

# 3.0 Tech Stack

_Server Packages:_ Typescript, MongoDB, Express.js , Node.js, bcryptjs, cookie-parser, jest, supertest.


# 4.0 Docker iamges uploaded here

```bash
https://hub.docker.com/repository/docker/abhyuday1212/backend-assignment
```

 

# 5.0 Postman Link

```bash
https://backend-assignment-7713.postman.co/workspace/backend-assignment-Workspace~86dacae8-dd00-4f7c-9a24-12ba3377e181/collection/29496688-5a0d9a86-8c50-4072-bd0c-6c02b3f3a1c1?action=share&creator=29496688
```

# 6.0 Running Test Cases

### To run all test cases:

```bash
npm test
```

### To run individual test suites:

```bash
npm test -- tests/user.test.ts
npm test -- tests/admin.test.ts
npm test -- tests/auth.test.ts
npm test -- tests/security.test.ts
```

# 7.0 Images
Please check the public/assets folder for images.

 
