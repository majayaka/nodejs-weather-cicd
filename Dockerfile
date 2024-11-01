# Dockerfile

FROM node:18


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 to access the app
EXPOSE 3000

# Command to run the app
CMD ["node", "server.js"]
