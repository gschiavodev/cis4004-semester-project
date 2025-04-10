# Riddle Survival Game

This project is a fullstack application built with Django for the backend, React for the frontend, and a SQLite database.

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone https://github.com/gschiavodev/cis4004-semester-project.git
   cd cis4004-semester-project
   ```

2. **Initalize the database**
   ```
   cd backend
   conda env create --file=backend-env.yaml
   conda activate backend-env
   python manage.py makemigrations
   python manage.py migrate
   conda deactivate
   cd ..
   ```

3. **Build and run the application using Docker Compose:**
   ```
   docker-compose up --build
   ```

4. **Access the application:**
   - The React frontend will be available at `http://localhost:5173`.
   - The Django backend will be available at `http://localhost:8000`.

# AI Uses
   
   For the project the main purpose of AI assistance in writing code was for debugging errors and code refactoring. Some example prompts would be as follows:
      - "Why is this backend view returning a 404 instead of the desired 200 with this input?"
      - "Can you cleanup the code on this page so it is more readable and commented appropriately?"
