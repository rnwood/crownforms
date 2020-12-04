![gdforms](./logo.svg)

**A low-code e-forms renderer and designer aiming to conform to the UK Government GDS Design System.** Includes Granicus/Firmstep Forms import to allow migration of existing services and the skills of existing form authors.

## Motivation ##

- There are no free and easy to use low-code e-forms packages that are GDS compliant by default. *So many government agency are duplicating the effort into achieving this or avoiding low-code totally*
- Firmstep/Granicus Forms (aka AchieveForms) is targeted at and widely used by local authorities. It is one of the most powerful e-forms engines that doesn't cost £££££s but in my opinion has some major issues:
  - It is hard to achieve processes that follow the GDS guidelines because the default behaviour need to be overriden on a per field/form basis to achieve this. *This does not scale well once you have more than a handful of forms*
  - Lookup and submission integrations (which are crucial to build anything non-trivial) do not have a documented way to detect errors and either retry or show a failure message. *This means it's hard to make services reliable and customers data can be lost.*
  - Rolling updates are great, but it's really hard to efficiently and accurately replicate all services in the pre-production environment provided and test within the short window provided given the facilities available on the platform. *This means that this often does not happen, and crucial services can become unavailable*

## Objectives ##

gdforms aims to be:

- An easy to use but powerful low-code e-forms package so that processes can be developed in an agile manner and with low effort.

- GDS compliant and styled by default (which includes accessiblity and mobile responsiveness)

- Compatible with both the forms and skills of forms authors from Firmstep/Granicus platform.

- Easy to deploy on public/private clouds (Kubernetes) with organisations retaining control of the deployment and of their own data.

- Easy to test, apply and rollback upgrades to the platform - self managed.

- Highly scalable and cheap to run.

- Easy to version forms correctly so that changes to forms can be prepared and tested and then promoted to be visible to the public reliably when ready.

- 'Eventually reliable' by default. We will ensure that integration errors can be handled as chosen by forms designers with sensible defaults wherever possible that avoid silent data loss or bad CX when thing don't work as expected.

gdforms does not currently aim to be:

- A CRM or 'CRM lite' system to deal with fulfilment of requests from customer once they have been submitted.

- A general purpose integration system. We will implement HTTP integrations only and suggest implementors should use a mature integration platform like Microsoft Power Automate, or LogicApps if requirements are more advanced.

- An identity provider or login/registration system for users. We plan to support SSO login via the modern standards OAUTH2 and OpenID Connect, which  allow the use of many mature and easy to set up products like Azure Active Directory B2C, Auth0.

## Status ##

The application is at a proof-of-concept stage. 

The forms engine can already import and run many simple and moderately complex Firmstep forms with reasonable fidelity and a good (and GDS compliant) customer experience.

The designer is currently the next priority.

**Please contact me if you are interested in using gdforms**

## Development ##

1) **Get access to a Kubernetes cluste and make sure you have [Helm](https://helm.sh/) installed**

> You can use [MiniKube](https://minikube.sigs.k8s.io/docs/) locally to run this on any OS. Run `minikube start` once installed to get up and running.

2) **Point your local Docker client at the Docker service in the cluster.**

> For MiniKube run `minikube docker-env` and read the instructions. 

3) **Build the initial container image for the app:**
```
docker build -t gdforms .
```

4) **Deploy the full stack:**
```
helm install --set image.repository=gdforms --set image.tag=latest gdforms .\charts\gdforms\
```

5) **Wait for the deployment to complete and for init to run**

> MiniKube: You can view the status in the dashbord by running `minikube dashboard`

6) **Start debugging the app in VSCode using the provided targets.**
This uses [Bridge to Kubernetes](https://devblogs.microsoft.com/visualstudio/bridge-to-kubernetes-ga/)

7) **You can access at [http://localhost:3000](http://localhost:3000)** The framework we build on support hot-reload, so you can just save changes and they will be visible automatically.
