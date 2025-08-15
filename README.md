# Gene Expression Omnibus App

**Author:** Simon Reuter

### Project Description

This Project aim is a small full-stack web application showcasing some data from the Gene Expression Omnibus


### Requirements

This application is designed to be run on a Linux machine (developed on ubuntu 22.04), in order for this app to work properly please use a similar operating system.
In addition to the Linux machine some further requirements have to be met, the following tools must be present on your machine:
 - Docker
 - pip
 - python3

### setup

Before using the database the container in which it runs must be setup, for this use the following command in the projects directory, this may take a few minutes when setting this up the first time.

```bash
docker compose up -d
```

When the app is no longer needed, power the container down with the next command (can be restarted easily with the first command).

```bash
docker compose down
```


