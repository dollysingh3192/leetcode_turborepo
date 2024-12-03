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

## LeetCode Clone: Deployment and Management Commands

> **Note**: All resources are deployed in a namespace called `leetcode`.

```bash
Note: In this application all resources are deployed in a namespace called leetcode

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
kubectl get namespaces
kubectl create namespace leetcode
kubectl delete namespace leetcode
kubectl get pods
kubectl get all
kubectl get pods,svc -n leetcode

Check the logs of the backend pod
kubectl logs <backend-pod-name> --namespace leetcode

List env in pods
printenv

Port forwarding to backend service
kubectl port-forward svc/backend-service 3000:3000 --namespace leetcode

Port forwarding to rabbitmq service
kubectl port-forward svc/rabbitmq 15672:15672 -n leetcode
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
helm upgrade leetcode1 leetcode-chart --namespace leetcode --debug --dry-run (shows error when trying to upgrade)
helm history leetcode
helm uninstall leetcode
helm status leetcode


Run below command from root of repository
docker build -f apps/server/Dockerfile -t your-image-name .

List image content
docker run -it --entrypoint /bin/sh IMAGE_NAME

//Inside the cluster the hostname is rabbitmq.leetcode.svc.cluster.local these settings are overridden in the helm chart using the fullnameOverride and namespaceOverride values respectively.
amqp://myuser:mypassword@rabbitmq.leetcode.svc.cluster.local:5672
                        @<service-name>.<namespace>.svc.cluster.local:<port>

minikube start
minikube stop
docker container prune
docker image rm leetcode/worker


From within the RabbitMQ pod shell, run:
rabbitmqctl list_queues
rabbitmqctl list_connections
rabbitmq-plugins list
rabbitmq-plugins enable rabbitmq_management
kubectl port-forward svc/<rabbitmq-service-name> 15672:15672 -n <namespace>
kubectl port-forward svc/rabbitmq 15672:15672 -n leetcode
http://localhost:15672

"amqp://{{ .Values.rabbitmq.auth.username }}:{{ .Values.rabbitmq.auth.password }}@{{ .Values.rabbitmq.fullnameOverride }}.{{ .Values.rabbitmq.namespaceOverride }}.svc.cluster.local:5672"
"amqp://myuser:mypassword@rabbitmq.leetcode.svc.cluster.local:5672"

kubectl patch scaledobject.keda.sh worker-scaledobject -n leetcode --type merge -p '{"metadata":{"finalizers":[]}}'
kubectl patch triggerauthentication.keda.sh keda-trigger-auth-rabbitmq-conn -n leetcode --type merge -p '{"metadata":{"finalizers":[]}}'
kubectl get triggerauthentication.keda.sh -n leetcode
kubectl logs deployment/keda-operator -n keda
kubectl get scaledobjects -n leetcode
kubectl port-forward svc/rabbitmq 15672:15672 -n leetcode
kubectl get hpa -n leetcode
kubectl get deployments -n leetcode
kubectl get pods -n leetcode

echo -n "amqp://myuser:mypassword@rabbitmq.leetcode.svc.cluster.local:5672" | base64

Helpful github links
* https://github.com/dollysingh3192/docker-development-youtube-series

Learning's of leetcode system design reference:
* https://www.hellointerview.com/learn/system-design/problem-breakdowns/leetcode

FOR KEDA:  
 * https://github.com/kedacore/sample-go-rabbitmq/tree/main
 * https://maddevs.io/writeups/keda-based-rabbitmq-custom-metric-for-hpa/
 * https://medium.com/cuddle-ai/auto-scaling-microservices-with-kubernetes-event-driven-autoscaler-keda-8db6c301b18


install keda
install rabbitmq
then deployment
then scaledobject

```

```
https://keda.sh/docs/2.10/deploy/#uninstall

To install infra:
helm install my-app . --values values-prod.yaml -n keda

To Uninstall infra:
kubectl delete $(kubectl get scaledobjects.keda.sh,scaledjobs.keda.sh -A \
  -o jsonpath='{"-n "}{.items[*].metadata.namespace}{" "}{.items[*].kind}{"/"}{.items[*].metadata.name}{"\n"}')
helm uninstall my-app -n keda 


also
helm install my-app . --values values-prod.yaml -n keda
helm uninstall my-app -n keda --cascade=foreground

NOTE:
Deletion will wait until all child resources are completely removed before the parent resource is deleted.
This process may take longer compared to default deletion.
It ensures a clean and predictable deletion order based on Kubernetes' ownership hierarchy.

```


```bash
           +----------------------+
           | External Metrics      |
           | (RabbitMQ queue size) |
           +----------------------+
                    ↑
                    | KEDA monitors
                    ↓
           +----------------------+
           |       KEDA             |
           | Creates HPA Resource   |
           +----------------------+
                    ↑
                    | Sends scaling triggers
                    ↓
           +----------------------+
           |       HPA              |
           |  Adjusts replicas in   |
           |  Worker Deployment     |
           +----------------------+
                    ↑
                    | Modifies replica count
                    ↓
           +----------------------+
           |   Worker Deployment   |
           | Runs worker pods      |
           +----------------------+

```

Packet to test the keda in the rabbitmq pod up by helm 
```js
{"problemId":"670b690d3559b9c9c353bdf9","code":"function twoSum(nums, target) {const map = new Map();\n    \n    for(let i = 0; i < nums.length; i++) {\n        let n = nums[i];\n        let diff = target - n;\n        \n        if(map.has(diff)) {\n            return [map.get(diff), i];\n        } else {\n            map.set(n, i);\n        }\n        \n    }}","timestamp":"2024-11-29T09:49:38.954Z","userId":"670b69df1d799b0575866ebc"}
```