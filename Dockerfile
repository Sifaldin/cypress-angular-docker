FROM cypress/base:14.15.4

RUN mkdir /app

WORKDIR /app

COPY . /app

RUN npm install

RUN $(npm bin)/cypress verify

RUN ["npm", "run", "cypress:e2e"]