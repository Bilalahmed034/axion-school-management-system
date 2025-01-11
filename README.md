# School Management System API

## Overview

A RESTful API service for managing schools, classrooms, and students with role-based access control (RBAC).

## Technology Stack

- Node.js/Express.js
- MongoDB with Mongoose
- Redis for caching
- JWT Authentication
- Express Rate Limiter
- Ion Cortex
- Aeon Machine
- Qantra Pineapple

## API Documentation

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
    "username": "admin",
    "email": "admin@school.com",
    "password": "securePassword123",
    "role": "admin"
}

Response (200 OK):
{
    "user": {
        "_id": "user_id",
        "username": "admin",
        "email": "admin@school.com",
        "role": "admin",
        "createdAt": "2024-03-15T12:00:00.000Z"
    },
    "token": "jwt_token"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "admin@school.com",
    "password": "securePassword123"
}

Response (200 OK):
{
    "token": "jwt_token",
    "user": {
        "_id": "user_id",
        "email": "admin@school.com",
        "role": "admin"
    }
}
```

### Schools API

#### Create School

```http
POST /api/school/createSchool
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "name": "Test School",
    "location": "Test Location",
    "contactNumber": "1234567890",
    "email": "school@test.com",
    "capacity": 1000
}

Response (200 OK):
{
    "school": {
        "_id": "school_id",
        "name": "Test School",
        "location": "Test Location",
        "contactNumber": "1234567890",
        "email": "school@test.com",
        "capacity": 1000,
        "status": "active",
        "createdAt": "2024-03-15T12:00:00.000Z",
        "updatedAt": "2024-03-15T12:00:00.000Z"
    }
}
```

#### Get All Schools

```http
GET /api/school/getAllSchools?page=1&limit=10
Authorization: Bearer jwt_token

Response (200 OK):
{
    "schools": [
        {
            "_id": "school_id_1",
            "name": "School 1",
            "location": "Location 1",
            "contactNumber": "1234567890",
            "email": "school1@test.com",
            "capacity": 1000,
            "status": "active"
        }
    ],
    "pagination": {
        "total": 1,
        "page": 1,
        "pages": 1
    }
}
```

#### Update School

```http
PUT /api/school/updateSchool/:schoolId
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "name": "Updated School Name",
    "location": "Updated Location",
    "contactNumber": "9876543210"
}

Response (200 OK):
{
    "school": {
        "_id": "school_id",
        "name": "Updated School Name",
        "location": "Updated Location",
        "contactNumber": "9876543210",
        "updatedAt": "2024-03-15T12:00:00.000Z"
    }
}
```

### Classrooms API

#### Create Classroom

```http
POST /api/classroom/createClassroom/:schoolId
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "name": "Class A",
    "capacity": 30,
    "grade": "10",
    "section": "A",
    "academicYear": "2024-2025"
}

Response (200 OK):
{
    "classroom": {
        "_id": "classroom_id",
        "name": "Class A",
        "capacity": 30,
        "grade": "10",
        "section": "A",
        "academicYear": "2024-2025",
        "school": "school_id",
        "createdAt": "2024-03-15T12:00:00.000Z"
    }
}
```

#### Get Classrooms

```http
GET /api/classroom/getClassrooms/:schoolId?page=1&limit=10
Authorization: Bearer jwt_token

Response (200 OK):
{
    "classrooms": [
        {
            "_id": "classroom_id",
            "name": "Class A",
            "capacity": 30,
            "grade": "10",
            "section": "A",
            "academicYear": "2024-2025",
            "school": {
                "_id": "school_id",
                "name": "School Name"
            }
        }
    ],
    "pagination": {
        "total": 1,
        "page": 1,
        "pages": 1
    }
}
```

### Students API

#### Enroll Student

```http
POST /api/student/enrollStudent/:schoolId/:classroomId
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2010-01-01",
    "gender": "male",
    "contactNumber": "1234567890",
    "address": "123 Street, City",
    "guardianName": "Jane Doe",
    "guardianContact": "0987654321"
}

Response (200 OK):
{
    "student": {
        "_id": "student_id",
        "firstName": "John",
        "lastName": "Doe",
        "dateOfBirth": "2010-01-01",
        "gender": "male",
        "contactNumber": "1234567890",
        "address": "123 Street, City",
        "guardianName": "Jane Doe",
        "guardianContact": "0987654321",
        "school": "school_id",
        "classroom": "classroom_id",
        "createdAt": "2024-03-15T12:00:00.000Z"
    }
}
```

#### Get Students

```http
GET /api/student/getStudents/:schoolId/:classroomId?page=1&limit=10
Authorization: Bearer jwt_token

Response (200 OK):
{
    "students": [
        {
            "_id": "student_id",
            "firstName": "John",
            "lastName": "Doe",
            "dateOfBirth": "2010-01-01",
            "gender": "male",
            "school": "school_id",
            "classroom": "classroom_id"
        }
    ],
    "pagination": {
        "total": 1,
        "page": 1,
        "pages": 1
    }
}
```

#### Update Student

```http
PUT /api/student/updateStudent/:schoolId/:classroomId/:studentId
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "firstName": "John Updated",
    "lastName": "Doe Updated",
    "contactNumber": "9876543210"
}

Response (200 OK):
{
    "student": {
        "_id": "student_id",
        "firstName": "John Updated",
        "lastName": "Doe Updated",
        "contactNumber": "9876543210",
        "updatedAt": "2024-03-15T12:00:00.000Z"
    }
}
```

#### Transfer Student

```http
POST /api/student/transferStudent/:studentId
Authorization: Bearer jwt_token
Content-Type: application/json

{
    "newSchoolId": "new_school_id",
    "newClassroomId": "new_classroom_id"
}

Response (200 OK):
{
    "student": {
        "_id": "student_id",
        "school": "new_school_id",
        "classroom": "new_classroom_id",
        "transferHistory": [
            {
                "fromSchool": "old_school_id",
                "fromClassroom": "old_classroom_id",
                "transferDate": "2024-03-15T12:00:00.000Z"
            }
        ]
    }
}
```

### Error Responses

#### Unauthorized Access

```http
Status: 401 Unauthorized
{
    "error": "Unauthorized",
    "code": 401
}
```

#### Bad Request

```http
Status: 400 Bad Request
{
    "error": "Invalid input data",
    "code": 400
}
```

#### Not Found

```http
Status: 404 Not Found
{
    "error": "Resource not found",
    "code": 404
}
```

#### Server Error

```http
Status: 500 Internal Server Error
{
    "error": "Something went wrong!",
    "code": 500
}
```

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables in .env:

```env
MONGO_URI=mongodb://localhost:27017/school_management
CACHE_PREFIX=school_mgmt_
CACHE_REDIS=redis://localhost:6379
CORTEX_PREFIX=school_mgmt_
CORTEX_REDIS=redis://localhost:6379
CORTEX_TYPE=school_management_api
JWT_SECRET=your_jwt_secret
TOKEN_EXPIRY=24h
PORT=3000
```

3. Start the server:

```bash
# Development
npm run dev

# Production
npm start
```

4. Run tests:

```bash
npm test
npm run test:coverage
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
