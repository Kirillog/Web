FROM ubuntu:22.04

RUN DEBIAN_FRONTEND=noninteractive \
    apt-get update \
    && apt-get install -y nodejs npm

RUN npm install --global @angular/cli

WORKDIR /home

# ENTRYPOINT [ "http-server", "-S", "-C", "certs/mkn.edu.crt", "-K", "certs/mkn.edu.key" ]
ENTRYPOINT [ "/bin/bash" ]