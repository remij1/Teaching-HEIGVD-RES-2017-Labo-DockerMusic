FROM node:4.3.1
MAINTAINER Remi Jacquemard <remi.jacquemard@heig-vd.ch>

#
# When we build the image, we copy the executable jar in the image file system. 
#
COPY src /opt/app/

WORKDIR /opt/app/
RUN npm install

ENTRYPOINT ["node", "/opt/app/app.js"]
