# PseudoServe

PseudoServe is a dynamic API mocking tool designed to streamline frontend development by allowing developers to create temporary backend services on-the-fly. With PseudoServe, frontend developers can define API endpoints along with their expected request and response structures, making it easier to test frontend functionalities without waiting for the backend services to be implemented.

## Features

- **Dynamic API Creation:** Instantly create APIs with specified request and response bodies.
- **Flexible Request/Response Definitions:** Easily define the structure of your API's requests and responses.
- **Development Efficiency:** Accelerate frontend development by removing dependencies on backend implementation timelines.

## Getting Started

These instructions will get you a copy of PseudoServe up and running on your local machine for development and testing purposes.

### Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v12.0 or later)
- npm (v6.0 or later)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Thunderk3g/pseudoserve.git
cd pseudoserve
```
2. Install all the necessary dependencies .
   
```bash
npm install
```
3.Running PseudoServe
```bash
npm start
nodemon start
node index.js
```

4.Usage . 
 - To create a temporary API, send a POST request to http://localhost:3000/create-temp-api with the following JSON body:
```bash
{
  "path": "/your/api/path",
  "method": "get",
  "requestExample": {},
  "responseExample": {
    "message": "This is a mock response"
  }
}
```

## Contributing
Contributions to PseudoServe are welcome! Feel free to submit pull requests to add features, fix bugs, or improve documentation.

## License
This project is licensed under a custom license. Users must provide credit to the original author(s) in any derivative works or publications that leverage this project.

## Acknowledgments
A big thank you to the Node.js community for the extensive libraries and resources.
All contributors who have helped to make PseudoServe better.
