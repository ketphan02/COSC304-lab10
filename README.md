# COSC 304 Project

## How to run
```bash
> docker-compose up -d db
> docker exec -it mysql mysql -u root -p 
type cosc304 for password
> CREATE USER 'root'@'%' IDENTIFIED BY 'cosc304';
> GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
> FLUSH PRIVILEGES;
> exit
> docker-compose up app --build
```

## Deployed

