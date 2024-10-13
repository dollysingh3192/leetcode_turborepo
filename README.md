```
In this repository, we have two services: server and worker. The server is responsible for handling requests from the client and interacting with the database. The worker is responsible for processing the code submissions and updating the database accordingly. Both services are implemented using Node.js and TypeScript.

It also has interface app in interface folder which is responsible for rendering the UI and handling user interactions.
A minimal setup that has /problems route and /problems/:id route where we can submit code.

When code is submitted, it is sent to the worker service which will process it and update the database. With Accepted/Rejected status.

I have created a common package for the server and worker services. This is prism schema which is used for connecting to the database.

I have created a helm chart for deploying the application to kubernetes.
In this i have added rabbitmq as a dependency and created a rabbitmq service and a rabbitmq replicaset.
I have also created a backend service and a backend replicaset.
I have created a worker service replicaset. (Need to wait for rabbitmq to be ready)

Upcoming Changes:
KEDA setup for scaling the worker replicaset as per rabbitmq queue size.
Prometheus setup for monitoring the application.


Clone the repository
Install dependencies  => `npm install`
Do the build => `npm run build`
Run the server => `npm run dev`

Docker Commands

docker tag leetcode/worker:latest dollysingh3192/leetcode-worker:v1
docker push dollysingh3192/leetcode-worker:v1
docker pull  dollysingh3192/leetcode-worker:v1
docker run -it --entrypoint /bin/sh dollysingh3192/leetcode-worker:v1
docker run --name my-backend-container -p 3000:3000 my-backend-app
docker run --name my-backend-container -d --rm -p 3000:3000 my-backend-app
docker ps

Kubernetes Commands
kubectl create namespace leetcode-clone
kubectl get pods
kubectl get all
kubectl get pods,svc -n leetcode-clone

Check the logs of the backend pod
kubectl logs <backend-pod-name> --namespace leetcode-clone

List env in pods
printenv

Port forwarding
kubectl port-forward svc/backend-service 3000:3000 --namespace leetcode-clone


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


amqp://myuser:mypassword@rabbitmq.leetcode-clone.svc.cluster.local:5672
amqp://myuser:mypassword@rabbitmq.leetcode-clone.svc.cluster.local:5672


minikube start
minikube stop
docker container prune
docker image rm leetcode/worker

```