# TodoStack

TodoStack is a React single-page application that showcases a multi-plan todo manager with guest
access, authentication, and supporting marketing pages. Everything runs locally in the browser; no
external database is required for this trial version.

## Features

- Create, rename, and delete todo lists and items with completion tracking
- Free guest mode with advertising, 20 list limit, and 100 items per list
- Premium accounts (0.99 € / month) with limits expanded to 10,000 lists and items
- Registration and sign-in flows storing data in browser local storage
- Responsive layout with dedicated Contact, Legal, and Pricing pages

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed by Vite (defaults to `http://localhost:5173`) to explore the app. Use the
"Try the free version" button for an immediate guest session or create an account to persist your
lists under a username. Upgrade to premium from the dashboard to remove ads and unlock the larger
limits.

## Running locally with Docker

You can also serve the production build in a local Docker container:

```bash
docker build -t todostack .
docker run --rm -p 8080:8080 todostack
```

Visit `http://localhost:8080` to interact with the app served by nginx.

## Deploying to Google Cloud Run

1. Build and push the container image with Google Cloud Build:

   ```bash
   gcloud builds submit --tag gcr.io/PROJECT_ID/todostack
   ```

2. Deploy the image to Cloud Run (replace `PROJECT_ID` and `SERVICE_NAME`):

   ```bash
   gcloud run deploy SERVICE_NAME \
     --image gcr.io/PROJECT_ID/todostack \
     --platform managed \
     --region REGION \
     --allow-unauthenticated
   ```

Cloud Run will automatically route traffic to port 8080 exposed by the container. Update DNS or
share the generated service URL as needed.
