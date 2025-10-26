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

## Running with Docker

You can containerize the application using the provided `Dockerfile` to simplify local
development or create artifacts for deployment:

```bash
# Build the image (replace todo-stack with your preferred tag)
docker build -t todo-stack .

# Start the container and expose Vite on port 5173
docker run --rm -p 5173:5173 todo-stack
```

Open `http://localhost:5173` after the container starts to access the app. Use `CTRL+C` to stop the
process or add `-d` to run the container in detached mode.

## Deploying to Google Cloud Run

Follow these steps to deploy the Docker image to [Google Cloud Run](https://cloud.google.com/run):

1. **Authenticate and configure your project**
   ```bash
   gcloud auth login
   gcloud config set project <YOUR_GCP_PROJECT_ID>
   gcloud auth configure-docker
   ```

2. **Build and push the container image** to Google Artifact Registry (preferred) or Container
   Registry. The snippet below targets Artifact Registry in region `us-central1`:
   ```bash
   gcloud artifacts repositories create todostack-repo \
     --repository-format=docker \
     --location=us-central1 \
     --description="TodoStack images" # Run once per project

   docker build -t us-central1-docker.pkg.dev/<YOUR_GCP_PROJECT_ID>/todostack-repo/todo-stack:latest .
   docker push us-central1-docker.pkg.dev/<YOUR_GCP_PROJECT_ID>/todostack-repo/todo-stack:latest
   ```

3. **Deploy to Cloud Run** (allowing unauthenticated access to make the SPA publicly available):
   ```bash
   gcloud run deploy todo-stack \
     --image us-central1-docker.pkg.dev/<YOUR_GCP_PROJECT_ID>/todostack-repo/todo-stack:latest \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 5173
   ```

Cloud Run returns a service URL once deployment completes. Open the URL in a browser to verify the
application is running. Use `gcloud run services update` to roll out new versions after pushing
fresh images, or `gcloud run services delete` to remove the deployment when finished.
