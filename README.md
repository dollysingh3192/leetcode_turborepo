```
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