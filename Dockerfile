FROM pudding/docker-app:node-18-20230816

RUN apt-get update
RUN apt-get install -y pdftk