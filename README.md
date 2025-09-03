# Task System V1
This project is a task management system consisting of a backend (NestJS) and a frontend (React). Both services are configured to run using Docker and Docker Compose, along with a PostgreSQL database.

## Prerequisites

Make sure you have the following installed on your system:

*   **Docker Desktop:** Includes Docker Engine and Docker Compose.
    *   [Download Docker Desktop](https://www.docker.com/products/docker-desktop)

## Project Setup and Execution

1.  **Clone the Repository:**
    If you haven't already, clone this repository to your local machine.

    ```bash
    git clone <REPOSITORY_URL>
    cd Task-System-V1
    ```

2.  **Build and Bring Up Services:**
    Navigate to the project root where the `docker-compose.yml` file is located. Run the following command to build the Docker images and bring up all services (backend, frontend, and postgres) in the background:

    ```bash
    docker compose up --build -d
    ```

    *   `--build`: Rebuilds Docker images. Useful if you've made changes to `Dockerfile`s or dependencies.
    *   `-d`: Runs containers in "detached" mode (in the background).

3.  **Verify Service Status:**
    You can verify that all services are running correctly with:

    ```bash
    docker compose ps
    ```

    You should see `backend`, `frontend`, and `postgres` with a `running` status (and `healthy` for `postgres`).

4.  **Access the Application:**
    Once all services are up and running:
    *   **Frontend:** Open your web browser and go to `http://localhost:5173`
    *   **Backend API:** The backend API will be available at `http://localhost:3000`

## Running Tests

The backend includes end-to-end (E2E) tests to verify the API functionality.

To run the tests:

1. Ensure your PostgreSQL database is running and accessible with the correct environment variables set (matching those in your `.env` or Docker Compose).

2. From the `backend` directory, run the following command to execute the E2E tests:

    ```bash
    npm run test:e2e
    ```

3. The tests will connect to the database and run various API endpoint checks. Make sure the database credentials in your environment variables match those expected by the tests.


## Stopping Services

To stop and remove the containers, networks, and volumes created by `docker compose`:

```bash
docker compose down
