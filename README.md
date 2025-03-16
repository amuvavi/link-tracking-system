# Link Tracking System

## Overview

This project is a link tracking system that processes HTML content, shortens URLs, and tracks click analytics.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:

    ```sh
    git clone https://github.com/amuvavi/link-tracking-system.git
    cd link-tracking-system
    ```

2. Install the dependencies:

    ```sh
    npm install
    ```

## Running the Application

1. Start the application in development mode:

    ```sh
    npm run dev
    ```

2. Alternatively, you can build and start the application:

    ```sh
    npm run build
    npm start
    ```

## Testing the Application

### Unit Tests

Run the unit tests:

```sh
npm run test:unit

## API Endpoints

1. Shorten a URL

Endpoint: POST /shorten
Description: Shortens a given URL.


Request:

``{
  "url": "https://example.com"
}``

Response:

`{
  "originalUrl": "https://example.com",
  "shortUrl": "http://localhost:3000/abcd1234"
}`

Example:
`curl -X POST http://localhost:3000/shorten -H "Content-Type: application/json" -d '{"url": "https://example.com"}'`

Example:

2. Follow the Shortened URL
Endpoint: GET /:shortKey
Description: Redirects to the original URL.

`curl -L http://localhost:3000/abcd1234`

3. Get Analytics Data
Endpoint: GET /analytics/:shortKey
Description: Retrieves analytics data for a specific short URL.

Example:

`curl -X GET http://localhost:3000/analytics/abcd1234`

4. Process HTML and Replace URLs
Endpoint: POST /process/html
Description: Processes HTML content and replaces URLs with shortened URLs.

Request:
`{
  "html": "<html><body><a href=\"https://example.com/page1\">Link 1</a><a href=\"https://example.com/page2\">Link 2</a></body></html>"
}`

Response: Processed HTML with shortened URLs.
`curl -X POST http://localhost:3000/process/html -H "Content-Type: application/json" -d '{"html": "<html><body><a href=\"https://example.com/page1\">Link 1</a><a href=\"https://example.com/page2\">Link 2</a></body></html>"}'`
Example:

5. Process HTML Without Links
Endpoint: POST /process/html
Description: Processes HTML content without links.

Request:

`{
  "html": "<div>No links here</div>"
}`

Response: Processed HTML without changes.
`curl -X POST http://localhost:3000/process/html -H "Content-Type: application/json" -d '{"html": "<div>No links here</div>"}'`

Example:
`curl -X POST http://localhost:3000/process/html -H "Content-Type: application/json" -d '{"html": "<div>No links here</div>"}'`

License
This project is licensed under the MIT License.

