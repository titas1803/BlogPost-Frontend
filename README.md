# BlogPost Frontend

This is the frontend application for the BlogPost project, built using the MERN (MongoDB, Express, React, Node.js) stack. The frontend is responsible for providing a user-friendly interface for interacting with the blog platform.

## Features

- User authentication (login/register)
- Create, edit, and delete blog posts
- View a list of all blog posts
- Responsive design for various screen sizes

## Technologies Used

- **React**: Frontend library for building the user interface
- **Axios**: For making HTTP requests to the backend API
- **React Router**: For handling navigation and routing
- **CSS/SCSS**: For styling the application

## Prerequisites

Before running this project, ensure you have the following installed:

- Node.js (v14 or later)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/titas1803/BlogPost-Frontend.git
cd blogpost-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`.

## Folder Structure

```
/src
  /components    # Reusable React components
  /pages         # Application pages
  /services      # API service functions
  /styles        # Global and component-specific styles
  /utils         # Utility functions
```

## Backend Integration

This frontend application interacts with the BlogPost backend API. Make sure the backend server is running and update the API base URL in the configuration file if necessary.
_Backend sourcecode:_ `https://github.com/titas1803/BlogPost-backend.git`

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.
