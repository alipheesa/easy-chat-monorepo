# Easy Chat

A simple fullstack chat application with both debug and production environments set up via *docker-compose*.

This is the first pet project I built, and I learned a lot from it. It isn't \*perfect\*, and often not even \*good\* for obvious reasons, but it was such a valuable experience and such a nice challenge to overcome. In the end, I knew exactly what I did wrong and what I need to do in my next next projects to make my code 99% closer to the clean and easy-maintainable one.


## Quickstart

To setup the project, simply clone the git repo:
```console
$ git clone https://github.com/alipheesa/easy-chat.git
$ cd easy-chat
```
You are done!
Note that the whole env_files directory with sample files is included, which is considered security issue. You might want to add env_files folder in .gitignore later.

### Development environment (docker-compose)

```console
$ docker compose -f docker-compose.dev.yml -d --build
```


### Production environment (docker-compose)

```console
$ docker compose -f docker-compose.prod.yml -d --build
```

Note the amount of resources elasticsearch consumes on startup. This can prevent system from booting successfully on weak machines, especially in development environment. The solution is to restart crashed services one-by-one manually, when elasticsearch resource consumption is settled.


## Advanced project setup

.env files in env_files folder gives you opportunity of managing the whole project settings in one place.
Some settings for backend (core) service are listed below.

### Sentry

Set SENTRY_ENABLED to '1' or 'true' and add SENTRY_DSN link you've got from Sentry in order to enable Sentry.

```console

SENTRY_ENABLED=0
SENTRY_DSN=

```


### OAuth2

Set OAUTH_ENABLED_\*name\* to '1' or 'true' and add ID and Secret you've got from your OAuth provider.

```console
OAUTH_ENABLED_GOOGLE=0
OAUTH_ID_GOOGLE=
OAUTH_SECRET_GOOGLE=

OAUTH_ENABLED_GITHUB=0
OAUTH_ID_GITHUB=
OAUTH_SECRET_GITHUB=

```

Then, technically, you should specify a callback url to our app in provider OAuth settings. It should look like this:
```console
http://localhost/auth/accounts/google/login/callback/
http://localhost/auth/accounts/github/login/callback/
```
But it looks like some settings are not necessary if you are not actually deploying you app.

"Application homepage" setting in both google and github seems to be superfluous too when testing your application, setting it to http://localhost:3000 will work although it wouldn't make any sense either for your development or for production environment (This apparently applicable to other settings like "Authorized JavaScript origins").

When using Google as OAuth provider, don't forget to select ./auth/userinfo.profile scope in OAuth dashboard in order to be able to retrieve user's public profile data.


## Overview

This is just an another chat app heavily inspired by discord. What is possible in *easy-chat*? 
* Registration and JWT token authorization (Google/Github OAuth2 supported if you enable them and provide ID and a Secret in .env for core).
* Creation and management of groups, topic and rooms.
* Real-time message exchange, with user typing and online status change events served instantaneously via websockets.
* User and group profile customization with image crop.
* Overview of all public groups with a proper search feature.

Here is the listing of main project parts, their description and lessons I learned:

## Backend

Backend was built using *Django* and *Daphne* ASGI Server.
The list of main features:
* PostgreSQL database.
* Redis cache.
* Traditional authentication flow + OAuth2.
* Auth via JWT Tokens + custom middleware for auto-refresh.
* Celery (image cropping and compression tasks for user icons).
* Websockets for message exchange (user messages + events like "user is typing..." or "user entered room").
* *Elasticsearch* integration.
* Performance monitoring with *Sentry* (Overall).
* Performance monitoring with *Silky* (SQL Queries).

The list of related packages:
* DRF (django-rest-framework)
* django-allauth
* dj-rest-auth
* djangorestframework-simplejwt
* django-channels

### Conclusion
The overall code quality could be better (it increased dramatically in my following project), but there are also other important aspects to pay attention to.
Here is the list of thoughts:
* More consistency. Especially when we talk about serializers and views. Don't mix function- and class-based views. This wasn't a large project, and yet it was already difficult to navigate through things like "GroupCreateSerializer", "GroupDetailSerializer" and "GroupSerializer" and justify existence of some things. At the same time different viewsets inherited from (views.APIView), (viewsets.ModelViewSet) or (mixins.ListModelMixin, viewsets.GenericViewSet) are generally not a bad thing to do, unless you are mixing all of them in a single large file.
* Smaller views. Viewset "GroupViewSet" took almost 90 lines of code, although at the end of the day all it has to do is to simply override 3 of CRUD methods. A lot of code should be incapsulated in separate services.
* Comments and docstrings for each function and class. Documentation should be exhaustive yet simple to read.
* More tests. Application shouldn't be regarded as a black box, we should trust our system.
* Optimization. Premature optimization is evil, but some day we will need to analyze our queries with tools like *Silky* and begin caching and fixing every N+1 problem we didn't fix earlier.

## Frontend

SPA was built using *React* and *typescript*, with *Vite* as a frontend toolset instead of *CRA*.

Main features:
* Typescript.
* SPA routing handeled on frontend side.
* Fancy floating elements like tooltips and context menus built with *floating-ui* library (successor of *popper.js*).

The list of related packages:
* react-router-dom
* react-icons
* react-use-websockets
* axios
* floating-ui
* formik + yup

### Conclusion
Here is the list of thoughts:
* Follow best practices when considering your folder structure. The contents of each directory should be predictable, maximum folder depth should not exceed 3-4 folders, deep nesting should be avoided and absolute imports should be used.
* Choose the right state management tool for your usecase. Here are the ones to consider: React Context API, Redux, MobX, Zustand, Recoil.
* Optimize your code. Avoid excessive re-renders by controlling component lifecycle and using useEffect, useRef, useCallback and useMemo right.
* Write more tests.
* Define a set of styling constants like colour codes beforehand, put it in a separate file (like tailwind.config.js).
* Examine your resulting bundle size and how each imported package impacts it.

I am also thinking about using the following packages in the next projects:
* framer-motion. Incredibly powerful animation tool for React. Will take your site to another level.
* react-query. Provides us with some additional features for API calls like caching.


## DevOps

As for DevOps part, at the moment of publishing this code the only things left to user are 2 docker-compose.yml files for development and production environments + nginx reverse-proxy setup. In docker-compose, the whole development environment consists of 7 services in total, including:
* Frontend (client)
* Backend (core)
* Database
* Redis
* Celery
* Celery Flower
* Elastic
  
In production environment, there is one additional service for nginx, but frontend container should be removed after successfull build, thus giving us same 7 running containers in total.
Some crucial for modern workflows tools and services are still being tested and left unpublished, including *Jenkins* and *Kubernetes*.

There is almost nothing to conclude until I posted Jenkinsfile, kubernetes manifests and helm charts, except one thing:
* Always use the least priveleged user in Dockerfiles, do not manage anything as root if it can be done as simple user.


## System Design

This might be the most important part in real-world applications and the part I should have spent more time with.

Every chat application is a very high-loaded system even with a relatively small amount of concurrent active users, and some measures should be taken to cope with challenges these systems encounter. Plus, we should think about concepts of High Availability and not only take care of handling a large amount of traffic, but also make our application stable and reliable.

In my system, we didn't make any database partitions or sharding. We didn't think about any redis HA architectures either (could make redis clusters or use redis sentiel).
As regards database model, only SQL is used, although some traffic-extensive tasks (reading/updating typing or online status - the most expensive tasks in such systems) always should take advantage of NoSQL benefits like faster reads/writes for large amounts of simple queries and easier scalability.

All these considerations are left for upcoming projects.
