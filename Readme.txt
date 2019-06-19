Example authication and call webervices

projects:
angular -> frontend (vs code)
nodejs -> backend (vs)

sql script to mysql 8:
host_routines.sql ->store prcedure
host_users.sql -> databases y table users
run the next command after scripts  
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'type_root_password';

flush privileges;

Change server values in project nodejs
services->configService.js

Change sever addres in project angular
src->services->config.service.ts 

App funtionality:
hashing password
generate JWT token
Create a new user with password
Get all users

frontend
configuracion->usuarios
get users and add new user




