# Postgres

Links útiles: 
- [Digital Ocean | Cómo instalar y utilizar PostgreSQL en Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-20-04-es)

### Iniciar servidor de postgres
```bash
$ sudo service postgresql start
```
Esto soluciona el siguiente error:
```
psql: could not connect to server: No such file or directory
    Is the server running locally and accepting
    connections on Unix domain socket "/var/run/postgresql/.s.PGSQL.5432"?
```
---

### Ingresar a postgres como usuario postgres
```bash
$ sudo -u postgres psql
```
Y luego, para salir de psql
```
postgres=# \q
```

---

### Crear rol en postgres
```bash
$ sudo -u postgres createuser --interactive
```
Importante crear usuario en linux con el mismo nombre para poder logearse en postgres

```bash
$ sudo adduser <nombre-de-usuario>
$ sudo -u <nombre-de-usuario> psql -d <database name>
```
- Nota: Si no se especifica nombre de base de datos, intenta conectarse por defecto a una BD con el mismo nombre del usuario

---

### Crear Base de Datos
```bash
$ sudo -u postgres createdb <nombre de la BD>
```

---

### Más comandos dentro de psql
```
\dt - ver tablas de datos
\q - salir

```



