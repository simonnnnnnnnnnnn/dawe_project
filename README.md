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
 - Node js
 - npm
 - vue

### setup

Before using the database, the container in which it runs must be setup, for this use the following command in the projects directory, this may take a few minutes when setting this up the first time.

```bash
docker compose up -d
```

When the app is no longer needed, power the container down with the next command (can be restarted easily with the first command).

```bash
docker compose down
```

If a rebuild or deletion of the volume is wanted, use the next command:
```bash
docker compose down -v
```

After the container is created, the server can be started using the following command (port 3307 must be available):
```bash
node server.js
```

After the server runs the app can be started with the next command (open a different terminal window), navigate to "frontend/src/", there run the ext command:
```bash
npm run dev
```

The data warehouse will be accessible at port 5173.

## Using the Data Warehouse

When starting the app, the Homepage will be shown, from here there are 6 active buttons: Platforms, Samples, Series, Datasets, Profiles and Impressum.

### Platforms

Platforms shows the different platforms with which analyses were done (just like in the GEO DB). Here new entries can be created using the "create" button, existing platforms can be viewed, edited and deleted.

**Create**

When this button is clicked a form open where the general info as well as the platform array can be filled with entries in the same form. It is also possible to add multiple rows to the platform array in one go, use the "add entry" button on the form for this. When the data entry is done, click on "update" at the bottom to write the changes, or discard them by clicking "cancel" (also at the bottom).

**View**

This button opens a window showing the full information on an entry, all Fields as well as the platform Array will be shown here. From this window direct edits of any field are not possible, that can only be done by using the "edit" button (just right to the "view button").



