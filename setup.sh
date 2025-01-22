#!/bin/bash

# Download and install nvm:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# Download and install Node.js:
nvm install 23
nvm use 23

# Verify the Node.js version:
node -v
nvm current

# Verify npm version:
npm -v

# Install Python3 and Django:
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-django

# Verify the Python version:
python3 --version # Should print the installed Python version.
pip3 --version # Should print the installed pip version.
