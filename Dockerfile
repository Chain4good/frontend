FROM node:20-alpine as builder

WORKDIR /app
COPY package*.json ./
COPY .env ./

# Add validation
RUN if [ ! -f .env ]; then echo "Error: .env file not found"; exit 1; fi

RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]