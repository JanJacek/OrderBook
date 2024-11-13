# set base image
FROM node:22.8.0

# Set the working directory
WORKDIR /app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Ensure ts-node is available
RUN yarn global add ts-node typescript

# Run the application
CMD ["yarn", "start"]