FROM node:18-alpine as build-step
WORKDIR /app/client
ENV PATH /app/client/node_modules/.bin:$PATH
COPY ./client /app/client
RUN rm -rf /app/client/node_modules
RUN npm install
RUN vite build

FROM python:3.11.11-alpine
WORKDIR /app
COPY --from=build-step /app/client/dist /app/client/dist 

COPY ./server /app/server
RUN pip install -r /app/server/requirements.txt
ENV FLASK_ENV=production
ENV FLASK_APP=server/app/app.py
ENV MONGODB_URI=mongodb://mongodb:27017

CMD ["gunicorn", "-b", ":3000", "server.app.app:app"]