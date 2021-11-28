# pull official base image
FROM node:14-alpine

# set working directory
ADD ./ /opt/webapp/
WORKDIR /opt/webapp

# add `/app/node_modules/.bin` to $PATH
ENV PATH /opt/webapp/node_modules/.bin:$PATH

# Run the image as a non-root user
RUN adduser -D myuser
USER myuser

# install app dependencies
COPY *.json ./
RUN npm install --silent
RUN npm i razzle --silent

# add app
COPY . ./

# Expose port
#EXPOSE 3000

# start app
CMD npm start
