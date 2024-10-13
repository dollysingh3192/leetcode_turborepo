# LeetCode Clone Application

This repository contains two core services:

- **Server**: Handles client requests and interacts with the database.
- **Worker**: Processes code submissions and updates the database with `Accepted/Rejected` status.

Both services are built using **Node.js** and **TypeScript**.

### Interface App
Located in the `interface` folder, this app is responsible for rendering the UI and handling user interactions. It includes:
- `/problems` route: Displays a list of problems.
- `/problems/:id` route: Allows code submission for specific problems.

When code is submitted, it is sent to the worker service for processing. The worker updates the database based on the results.

### Common Package
A shared package between the server and worker services, containing the **Prisma schema** for database connectivity.

### Kubernetes Deployment with Helm
We have set up a Helm chart to deploy the application in a Kubernetes cluster. This chart includes:
- **RabbitMQ** as a dependency, with its own service and replicaset.
- **Backend service** with a corresponding replicaset.
- **Worker service** replicaset (which waits for RabbitMQ to be ready).

### Upcoming Features
- **KEDA**: To enable scaling of the worker replicaset based on the size of the RabbitMQ queue.
- **Prometheus**: For monitoring the application.

## Getting Started
Clone the repository
- Install dependencies  => `npm install`
- Do the build => `npm run build`
- Run the server => `npm run dev`

```
Note: In my application all resources are deployed in a namespace called leetcode-clone

Docker Commands

docker tag leetcode/worker:latest dollysingh3192/leetcode-worker:v1
docker push dollysingh3192/leetcode-worker:v1
docker pull  dollysingh3192/leetcode-worker:v1
docker run -it --entrypoint /bin/sh dollysingh3192/leetcode-worker:v1
docker run --name my-backend-container -p 3000:3000 my-backend-app
docker run --name my-backend-container -d --rm -p 3000:3000 my-backend-app
docker ps
docker stop <id of the container>

Kubernetes Commands
kubectl create namespace leetcode-clone
kubectl get pods
kubectl get all
kubectl get pods,svc -n leetcode-clone

Check the logs of the backend pod
kubectl logs <backend-pod-name> --namespace leetcode-clone

List env in pods
printenv

Port forwarding to backend service
kubectl port-forward svc/backend-service 3000:3000 --namespace leetcode-clone

Port forwarding to rabbitmq service
kubectl port-forward svc/rabbitmq 15672:15672 -n leetcode-clone
then simply access rabbitmq management console at http://localhost:15672

HELM Commands

helm create leetcode-chart
helm dependency build
helm dependency update
helm install leetcode leetcode-chart (first time)
helm upgrade leetcode leetcode-chart (updates)
//inside chart folder
helm install leetcode . --values ./values.yaml
helm install leetcode . --values ./values-prod.yaml
helm list
helm upgrade leetcode1 leetcode-chart --namespace leetcode-clone --debug --dry-run (shows error when trying to upgrade)
helm history leetcode
helm uninstall leetcode
helm status leetcode


Run below command from root of repository
docker build -f apps/server/Dockerfile -t your-image-name .

List image content
docker run -it --entrypoint /bin/sh IMAGE_NAME

//Inside the cluster the hostname is rabbitmq.leetcode-clone.svc.cluster.local these settings are overridden in the helm chart using the fullnameOverride and namespaceOverride values respectively.
amqp://myuser:mypassword@rabbitmq.leetcode-clone.svc.cluster.local:5672
                        @<service-name>.<namespace>.svc.cluster.local:<port>

minikube start
minikube stop
docker container prune
docker image rm leetcode/worker


Helpful github links
https://github.com/dollysingh3192/docker-development-youtube-series

FOR KEDA:  https://github.com/kedacore/sample-go-rabbitmq/tree/main


```