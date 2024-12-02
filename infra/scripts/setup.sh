#!/bin/bash

set -e  # Exit immediately if a command exits with a non-zero status
set -o pipefail  # Catch errors in piped commands

# Load environment variables (assumes a .env file for local dev)
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Ensure essential variables are set
: "${DB_NAME:?Environment variable DB_NAME is required}"
: "${DB_USER:?Environment variable DB_USER is required}"
: "${DB_PASSWORD:?Environment variable DB_PASSWORD is required}"
: "${GITHUB_RUNNER_TOKEN:?Environment variable GITHUB_RUNNER_TOKEN is required}"
: "${GITHUB_REPO_URL:?Environment variable GITHUB_REPO_URL is required}"

# Update and upgrade the system
update_system() {
    echo "Updating and upgrading system packages..."
    sudo apt update && sudo apt upgrade -y
}

# Install PostgreSQL 16
install_postgres() {
    echo "Installing PostgreSQL 16..."
    sudo apt install -y wget gnupg
    wget -qO - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
    echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" | sudo tee /etc/apt/sources.list.d/pgdg.list
    sudo apt update && sudo apt install -y postgresql-16
    sudo systemctl enable postgresql && sudo systemctl start postgresql
}

# Set up the PostgreSQL database
setup_db() {
    echo "Configuring PostgreSQL database..."
    sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';"
    sudo -u postgres psql -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"

    echo "Storing database credentials in db-credentials.json..."
    cat <<EOF >db-credentials.json
{
    "db_name": "$DB_NAME",
    "db_user": "$DB_USER",
    "db_password": "$DB_PASSWORD"
}
EOF
    chmod 600 db-credentials.json
}

# Install Docker Engine
install_docker() {
    echo "Installing Docker..."
    sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
    sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
    sudo apt update && sudo apt install -y docker-ce
    sudo systemctl enable docker && sudo systemctl start docker
}

# Install GitHub Actions Runner
install_gh_actions_runner() {
    echo "Installing GitHub Actions Runner..."
    RUNNER_VERSION="2.308.0"
    RUNNER_DIR="/opt/actions-runner"
    sudo mkdir -p $RUNNER_DIR
    sudo curl -o $RUNNER_DIR/actions-runner.tar.gz -L https://github.com/actions/runner/releases/download/v${RUNNER_VERSION}/actions-runner-linux-x64-${RUNNER_VERSION}.tar.gz
    sudo tar -xzf $RUNNER_DIR/actions-runner.tar.gz -C $RUNNER_DIR
    sudo chown -R $USER:$USER $RUNNER_DIR

    echo "Configuring GitHub Actions Runner..."
    sudo $RUNNER_DIR/bin/installdependencies.sh
    $RUNNER_DIR/config.sh --url "$GITHUB_REPO_URL" --token "$GITHUB_RUNNER_TOKEN" --unattended
    sudo $RUNNER_DIR/svc.sh install
    sudo $RUNNER_DIR/svc.sh start
}

# Main script execution
main() {
    echo "Starting setup process..."
    update_system
    install_postgres
    setup_db
    install_docker
    install_gh_actions_runner
    echo "Setup completed successfully."
}

# Run the script
main
