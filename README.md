# Full-Stack Application with Docker

A complete development environment featuring Next.js frontend and Laravel backend, fully containerized with Docker.

## 🚀 Quick Start

Get the application running in 4 simple steps:

```bash
# 1. Clone the repository
git clone https://github.com/WiltonBaltazar/lendaplus-app.git
cd lendaplus-app

# 2. Set up environment files
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local

# 3. Start with Docker
docker-compose up --build

# 4. Set up database (run in a new terminal)
docker-compose exec laravel-app php artisan migrate
docker-compose exec laravel-app php artisan db:seed
```

**That's it!** Your application will be available at:
- 🌐 **Frontend**: http://localhost:3000
- 🔧 **Backend API**: http://localhost:8000
- 🗄️ **Database Admin**: http://localhost:8080

## 📋 Prerequisites

Make sure you have these installed:
- [Docker](https://docs.docker.com/get-docker/) (version 20.0+)
- [Docker Compose](https://docs.docker.com/compose/install/) (version 2.0+)

### Installation Links:
- **Windows**: [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- **Mac**: [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Linux**: [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/)

## 🏗️ Project Structure

```
├── docker-compose.yml          # Docker services configuration
├── frontend/                   # Next.js application
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── backend/                    # Laravel application
│   ├── Dockerfile
│   ├── composer.json
│   └── ...
└── README.md
```

## 🔧 Services Overview

| Service | Port | Description |
|---------|------|-------------|
| **nextjs-app** | 3000 | Next.js frontend with hot reload |
| **laravel-app** | 8000 | Laravel backend API |
| **mariadb** | 3306 | MariaDB database |
| **redis** | 6379 | Redis cache |
| **phpmyadmin** | 8080 | Database management interface |

## 🛠️ Detailed Setup

### 1. Clone and Navigate
```bash
git clone https://github.com/WiltonBaltazar/lendaplus-app.git
cd lendaplus-app
```

### 2. Environment Configuration

#### Backend Environment (.env)
```bash
cp backend/.env.example backend/.env
```
The default configuration works out of the box! Key settings:
```env
DB_HOST=mariadb
DB_DATABASE=laravel_db
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password
REDIS_HOST=redis
```

#### Frontend Environment (.env.local)
```bash
cp frontend/.env.local.example frontend/.env.local
```
Default configuration:
```env
NEXT_LARAVEL_API_URLL=http://localhost:8000/api/v1
```
Generate configuration NEXTAUTH_SECRET on: https://auth-secret-gen.vercel.app/

### 3. Start the Application
```bash
# Build and start all services
docker-compose up --build

# Or run in background
docker-compose up -d --build
```

### 4. Database Setup (Required)

⚠️ **Important**: After the containers are running, you must set up the database:

```bash
# Wait for containers to be fully ready, then run:
docker-compose exec laravel-app php artisan migrate

# Seed the database with initial data
docker-compose exec laravel-app php artisan db:seed
```

#### Alternative: Fresh Migration with Seed
```bash
# Drop all tables, migrate, and seed in one command
docker-compose exec laravel-app php artisan migrate:fresh --seed
```

#### Database Setup Verification
```bash
# Check if migrations ran successfully
docker-compose exec laravel-app php artisan migrate:status

# List all tables
docker-compose exec mariadb mysql -u laravel_user -p laravel_db -e "SHOW TABLES;"
```

### 5. First-time Setup (Automatic)
The containers will automatically:
- ✅ Install all dependencies
- ✅ Generate Laravel application key
- ✅ Configure proper permissions
- ⚠️ **Manual step required**: Run migrations and seeds (step 4 above)

## 🌐 Accessing the Application

Once all containers are running and database is set up:

### Frontend (Next.js)
- **URL**: http://localhost:3000
- **Features**: Hot reload, API proxy to backend

### Backend API (Laravel)
- **URL**: http://localhost:8000
- **API Endpoints**: http://localhost:8000/api/v1
- **Health Check**: http://localhost:8000/api/health

### Database Management
- **PHPMyAdmin**: http://localhost:8080
- **Login**: 
  - Server: `mariadb`
  - Username: `laravel_user`
  - Password: `laravel_password`

## 🔄 Development Workflow

### Starting Development
```bash
# Start all services
docker-compose up

# Start specific services only
docker-compose up nextjs-app laravel-app mariadb
```

### Making Changes
- **Frontend**: Edit files in `frontend/` - changes auto-reload
- **Backend**: Edit files in `backend/` - changes auto-reload
- **Database**: Changes persist in Docker volume

### Database Management Commands
```bash
# Run new migrations
docker-compose exec laravel-app php artisan migrate

# Rollback last migration
docker-compose exec laravel-app php artisan migrate:rollback

# Reset and reseed database
docker-compose exec laravel-app php artisan migrate:fresh --seed

# Seed database only
docker-compose exec laravel-app php artisan db:seed

# Seed specific seeder
docker-compose exec laravel-app php artisan db:seed --class=UserSeeder

# Create new migration
docker-compose exec laravel-app php artisan make:migration create_example_table

# Create new seeder
docker-compose exec laravel-app php artisan make:seeder ExampleSeeder
```

### Common Commands
```bash
# View logs
docker-compose logs -f laravel-app
docker-compose logs -f nextjs-app

# Execute commands in containers
docker-compose exec laravel-app php artisan migrate
docker-compose exec laravel-app php artisan make:controller ApiController
docker-compose exec nextjs-app npm install new-package

# Access container shell
docker-compose exec laravel-app bash
docker-compose exec nextjs-app sh

# Restart specific service
docker-compose restart laravel-app
```

### Installing New Packages

#### Backend (Laravel)
```bash
docker-compose exec laravel-app composer require package-name
```

#### Frontend (Next.js)
```bash
docker-compose exec nextjs-app npm install package-name
```

## 🛑 Stopping the Application

```bash
# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ This deletes database data!)
docker-compose down -v

# Stop and remove everything including images
docker-compose down -v --rmi all
```

## 🔍 Troubleshooting

### Port Already in Use
If you get port conflicts:
```bash
# Check what's using the port
lsof -i :3000  # or :8000, :3306

# Modify ports in docker-compose.yml
ports:
  - "3001:3000"  # Change external port
```

### Permission Issues
```bash
# Fix Laravel permissions
docker-compose exec laravel-app chown -R www-data:www-data storage bootstrap/cache
docker-compose exec laravel-app chmod -R 775 storage bootstrap/cache
```

### Database Connection Issues
```bash
# Restart MariaDB
docker-compose restart mariadb

# Check MariaDB logs
docker-compose logs mariadb

# Reset database
docker-compose down -v
docker-compose up --build
# Then run migrations again:
docker-compose exec laravel-app php artisan migrate --seed
```

### Migration Issues
```bash
# Check migration status
docker-compose exec laravel-app php artisan migrate:status

# Force run migrations (if stuck)
docker-compose exec laravel-app php artisan migrate --force

# Reset all migrations and start fresh
docker-compose exec laravel-app php artisan migrate:fresh --seed
```

### Container Won't Start
```bash
# Check container status
docker-compose ps

# View error logs
docker-compose logs service-name

# Rebuild specific service
docker-compose up --build service-name
```

### Clear Everything and Start Fresh
```bash
# Nuclear option - removes everything
docker-compose down -v --rmi all
docker system prune -a
docker-compose up --build

# Don't forget to run migrations again:
docker-compose exec laravel-app php artisan migrate --seed
```

## 📊 Monitoring and Logs

### View All Logs
```bash
docker-compose logs -f
```

### Service-Specific Logs
```bash
docker-compose logs -f nextjs-app
docker-compose logs -f laravel-app
docker-compose logs -f mariadb
```

### Container Resource Usage
```bash
docker stats
```

## 🧪 Testing the Setup

### Quick Health Checks
```bash
# Frontend
curl http://localhost:3000

# Backend API
curl http://localhost:8000/api/v1

# Database connection
docker-compose exec mariadb mysql -u laravel_user -p laravel_db -e "SELECT 1;"

# Check if migrations ran
docker-compose exec laravel-app php artisan migrate:status
```

### API Testing
```bash
# Test API endpoint
curl -X GET http://localhost:8000/api/v1/test

# With headers
curl -H "Accept: application/json" http://localhost:8000/api/user
```

## 🔐 Production Notes

⚠️ **This setup is for development only!** For production:

1. **Environment Variables**: Use secure passwords and keys
2. **Database**: Use managed database service
3. **HTTPS**: Configure SSL certificates
4. **Performance**: Optimize Docker images
5. **Security**: Implement proper firewall rules
6. **Migrations**: Use `--force` flag and proper deployment strategies

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test with Docker: `docker-compose up --build`
5. Run migrations and seeds: `docker-compose exec laravel-app php artisan migrate --seed`
6. Submit a pull request

## 📝 License

[Your License Here]

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Verify migrations ran: `docker-compose exec laravel-app php artisan migrate:status`
3. View container logs: `docker-compose logs`
4. Create an issue in this repository
5. Include your OS, Docker version, and error messages

---

**Happy coding! 🎉**