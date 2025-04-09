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
