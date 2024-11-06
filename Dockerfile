# Use the Node.js Alpine image as the base image
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY /. /.
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 8080
CMD [ "node", "dist/server.js" ]


# Copy the rest of the application code

# Expose the port the app runs on
EXPOSE 8080

# Command to start the application
CMD [ "npm", "run", "dev" ]