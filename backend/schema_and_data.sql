PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE complexes (
	id INTEGER NOT NULL, 
	name VARCHAR, 
	address VARCHAR, 
	lat VARCHAR, 
	lng VARCHAR, 
	image VARCHAR, 
	PRIMARY KEY (id)
);
INSERT INTO complexes VALUES(1,'ЖК Лазурный','Ул. Приморская, 45',NULL,NULL,'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80');
INSERT INTO complexes VALUES(2,'ЖК Океан','Пр-кт Мира, 102',NULL,NULL,'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80');
INSERT INTO complexes VALUES(3,'ЖК Парк Авеню','Парковая зона, 12',NULL,NULL,'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?w=800&q=80');
INSERT INTO complexes VALUES(4,'Nest one','O''zbekiston shoh ko''chasi 49а','','','http://localhost:8000/uploads/d8b63536-11cf-4b69-a8bd-d7ce1ef90a2c.jpg');
CREATE TABLE clients (
	id INTEGER NOT NULL, 
	tg_id VARCHAR, 
	name VARCHAR, 
	phone VARCHAR, 
	created_at DATETIME, 
	PRIMARY KEY (id)
);
INSERT INTO clients VALUES(1,'12345678','Александр Волков','+998 90 123 45 67','2026-04-28 12:59:49.029533');
INSERT INTO clients VALUES(2,'87654321','Мария Соколова','+998 90 987 65 43','2026-04-28 12:59:49.029537');
INSERT INTO clients VALUES(3,'11223344','Иван Петров','+998 90 555 55 55','2026-04-28 12:59:49.029537');
CREATE TABLE apartments (
	id INTEGER NOT NULL, 
	complex_id INTEGER, 
	title VARCHAR, 
	description VARCHAR, 
	address VARCHAR, 
	price FLOAT, 
	guests INTEGER, 
	bedrooms INTEGER, 
	bathrooms INTEGER, 
	size VARCHAR, 
	lat VARCHAR, 
	lng VARCHAR, 
	status VARCHAR, 
	image VARCHAR, 
	amenities VARCHAR, images TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(complex_id) REFERENCES complexes (id)
);
INSERT INTO apartments VALUES(1,4,'Апартаменты 1 в ЖК Лазурный','Превосходные апартаменты в элитном комплексе ЖК Лазурный. Панорамные окна, дизайнерский ремонт и всё необходимое для комфортного проживания.','Ул. Приморская, 45, кв. 30',7000000.0,4,2,2,'35 м²','41.311081','69.240562','repair','https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80','[{"id":0,"name":"Wi-Fi","icon":"Wifi"},{"id":1,"name":"Кондиционер","icon":"Wifi"},{"id":2,"name":"Smart TV","icon":"Wifi"},{"id":3,"name":"Кофемашина","icon":"Wifi"},{"id":4,"name":"Бесконтактный заезд","icon":"Wifi"}]','["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80","http://localhost:8000/uploads/75b7c196-e813-4c3a-a88b-6fa154b70854.jpg"]');
INSERT INTO apartments VALUES(2,4,'Апартаменты 2 в ЖК Лазурный','П3ревосходные апартаменты в элитном комплексе ЖК Лазурный. Панорамные окна, дизайнерский ремонт и всё необходимое для комфортного проживания.','Ул. Приморская, 45, кв. 190',6000000.0,2,1,2,'90 м²','41.311081','69.240562','free','https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80','[{"id":0,"name":"феруз","icon":"Wifi"}]','["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80","http://localhost:8000/uploads/b599a387-0221-424d-9ebf-df88b526e562.jpg"]');
INSERT INTO apartments VALUES(3,1,'Апартаменты 3 в ЖК Лазурный','Превосходные апартаменты в элитном комплексе ЖК Лазурный. Панорамные окна, дизайнерский ремонт и всё необходимое для комфортного проживания.','Ул. Приморская, 45, кв. 28',7000000.0,6,2,2,'51 м²','41.311081','69.240562','busy','https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80','Wi-Fi,Кондиционер,Smart TV,Кофемашина,Бесконтактный заезд',NULL);
INSERT INTO apartments VALUES(4,2,'Апартаменты 1 в ЖК Океан','Превосходные апартаменты в элитном комплексе ЖК Океан. Панорамные окна, дизайнерский ремонт и всё необходимое для комфортного проживания.','Пр-кт Мира, 102, кв. 91',7000000.0,5,1,1,'85 м²','41.311081','69.240562','busy','https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80','Wi-Fi,Кондиционер,Smart TV,Кофемашина,Бесконтактный заезд',NULL);
INSERT INTO apartments VALUES(5,2,'Апартаменты 2 в ЖК Океан','Превосходные апартаменты в элитном комплексе ЖК Океан. Панорамные окна, дизайнерский ремонт и всё необходимое для комфортного проживания.','Пр-кт Мира, 102, кв. 179',8000000.0,6,3,2,'81 м²','41.311081','69.240562','free','https://images.unsplash.com/photo-1505691938895-1758d7eaa511?w=800&q=80','Wi-Fi,Кондиционер,Smart TV,Кофемашина,Бесконтактный заезд',NULL);
INSERT INTO apartments VALUES(6,2,'Апартаменты 3 в ЖК Океан','Превосходные апартаменты в элитном комплексе ЖК Океан. Панорамные окна, дизайнерский ремонт и всё необходимое для комфортного проживания.','Пр-кт Мира, 102, кв. 169',5000000.0,6,1,1,'70 м²','41.311081','69.240562','free','https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80','Wi-Fi,Кондиционер,Smart TV,Кофемашина,Бесконтактный заезд',NULL);
INSERT INTO apartments VALUES(7,3,'Апартаменты 1 в ЖК Парк Авеню','Превосходные апартаменты в элитном комплексе ЖК Парк Авеню. Панорамные окна, дизайнерский ремонт и всё необходимое для комфортного проживания.','Парковая зона, 12, кв. 71',3000000.0,2,1,1,'66 м²','41.311081','69.240562','free','https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800&q=80','Wi-Fi,Кондиционер,Smart TV,Кофемашина,Бесконтактный заезд',NULL);
CREATE TABLE bookings (
	id INTEGER NOT NULL, 
	apartment_id INTEGER, 
	client_id INTEGER, 
	check_in DATETIME, 
	check_out DATETIME, 
	total_price FLOAT, 
	status VARCHAR, 
	payment_method VARCHAR, 
	created_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(apartment_id) REFERENCES apartments (id), 
	FOREIGN KEY(client_id) REFERENCES clients (id)
);
INSERT INTO bookings VALUES(1,NULL,1,'2026-04-28 12:59:49.029977','2026-05-01 12:59:49.029977',2500000.0,'done','Payme','2026-04-27 12:59:49.029977');
INSERT INTO bookings VALUES(2,1,3,'2026-04-29 12:59:49.030846','2026-05-02 12:59:49.030846',1200000.0,'done','Payme','2026-04-28 12:59:49.030846');
INSERT INTO bookings VALUES(3,7,3,'2026-04-27 12:59:49.031088','2026-04-30 12:59:49.031088',2000000.0,'done','Payme','2026-04-26 12:59:49.031088');
INSERT INTO bookings VALUES(4,5,2,'2026-04-28 12:59:49.031197','2026-05-01 12:59:49.031197',2700000.0,'pending','Payme','2026-04-27 12:59:49.031197');
INSERT INTO bookings VALUES(5,6,2,'2026-04-24 12:59:49.031365','2026-04-27 12:59:49.031365',1000000.0,'confirmed','Payme','2026-04-23 12:59:49.031365');
INSERT INTO bookings VALUES(6,5,1,'2026-04-22 12:59:49.031465','2026-04-25 12:59:49.031465',1500000.0,'done','Payme','2026-04-21 12:59:49.031465');
INSERT INTO bookings VALUES(7,4,2,'2026-04-26 12:59:49.031478','2026-04-29 12:59:49.031478',1600000.0,'cancelled','Payme','2026-04-25 12:59:49.031478');
INSERT INTO bookings VALUES(8,7,1,'2026-04-26 12:59:49.031584','2026-04-29 12:59:49.031584',2300000.0,'pending','Payme','2026-04-25 12:59:49.031584');
INSERT INTO bookings VALUES(9,7,3,'2026-04-23 12:59:49.031596','2026-04-26 12:59:49.031596',1400000.0,'cancelled','Payme','2026-04-22 12:59:49.031596');
INSERT INTO bookings VALUES(10,NULL,2,'2026-04-25 12:59:49.031607','2026-04-28 12:59:49.031607',1200000.0,'cancelled','Payme','2026-04-24 12:59:49.031607');
INSERT INTO bookings VALUES(11,7,3,'2026-04-24 12:59:49.031618','2026-04-27 12:59:49.031618',1400000.0,'cancelled','Payme','2026-04-23 12:59:49.031618');
INSERT INTO bookings VALUES(12,NULL,1,'2026-04-26 12:59:49.031628','2026-04-29 12:59:49.031628',2100000.0,'confirmed','Payme','2026-04-25 12:59:49.031628');
INSERT INTO bookings VALUES(13,5,3,'2026-04-22 12:59:49.031640','2026-04-25 12:59:49.031640',1900000.0,'pending','Payme','2026-04-21 12:59:49.031640');
INSERT INTO bookings VALUES(14,4,3,'2026-04-20 12:59:49.031651','2026-04-23 12:59:49.031651',2100000.0,'confirmed','Payme','2026-04-19 12:59:49.031651');
INSERT INTO bookings VALUES(15,5,3,'2026-04-27 12:59:49.031663','2026-04-30 12:59:49.031663',2800000.0,'done','Payme','2026-04-26 12:59:49.031663');
INSERT INTO bookings VALUES(16,5,1,'2026-04-20 12:59:49.031674','2026-04-23 12:59:49.031674',1300000.0,'confirmed','Payme','2026-04-19 12:59:49.031674');
INSERT INTO bookings VALUES(17,3,1,'2026-04-22 12:59:49.031684','2026-04-25 12:59:49.031684',1700000.0,'cancelled','Payme','2026-04-21 12:59:49.031684');
INSERT INTO bookings VALUES(18,5,1,'2026-04-24 12:59:49.031783','2026-04-27 12:59:49.031783',2000000.0,'pending','Payme','2026-04-23 12:59:49.031783');
INSERT INTO bookings VALUES(19,4,1,'2026-04-21 12:59:49.031794','2026-04-24 12:59:49.031794',2800000.0,'pending','Payme','2026-04-20 12:59:49.031794');
INSERT INTO bookings VALUES(20,5,2,'2026-04-19 12:59:49.031803','2026-04-22 12:59:49.031803',1200000.0,'cancelled','Payme','2026-04-18 12:59:49.031803');
INSERT INTO bookings VALUES(21,1,1,'2026-04-19 12:59:49.031813','2026-04-22 12:59:49.031813',2500000.0,'pending','Payme','2026-04-18 12:59:49.031813');
INSERT INTO bookings VALUES(22,4,3,'2026-04-28 12:59:49.031822','2026-05-01 12:59:49.031822',1800000.0,'confirmed','Payme','2026-04-27 12:59:49.031822');
INSERT INTO bookings VALUES(23,6,1,'2026-04-28 12:59:49.031831','2026-05-01 12:59:49.031831',1200000.0,'cancelled','Payme','2026-04-27 12:59:49.031831');
INSERT INTO bookings VALUES(24,NULL,1,'2026-04-19 12:59:49.031840','2026-04-22 12:59:49.031840',2600000.0,'pending','Payme','2026-04-18 12:59:49.031840');
INSERT INTO bookings VALUES(25,1,1,'2026-04-24 12:59:49.031849','2026-04-27 12:59:49.031849',1200000.0,'done','Payme','2026-04-23 12:59:49.031849');
INSERT INTO bookings VALUES(26,1,1,'2026-05-18 19:00:00.000000','2026-05-20 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 12:29:23.092395');
INSERT INTO bookings VALUES(27,1,1,'2026-05-18 19:00:00.000000','2026-05-20 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 12:30:54.646960');
INSERT INTO bookings VALUES(28,3,1,'2026-05-16 19:00:00.000000','2026-05-20 19:00:00.000000',28000000.0,'pending','Tashkent','2026-05-08 12:32:17.132560');
INSERT INTO bookings VALUES(29,7,1,'2026-05-16 19:00:00.000000','2026-05-20 19:00:00.000000',12000000.0,'pending','Tashkent','2026-05-08 12:33:05.927961');
INSERT INTO bookings VALUES(30,1,1,'2026-05-17 19:00:00.000000','2026-05-20 19:00:00.000000',21000000.0,'pending','Tashkent','2026-05-08 12:34:15.577043');
INSERT INTO bookings VALUES(31,1,1,'2026-05-10 19:00:00.000000','2026-05-13 19:00:00.000000',21000000.0,'pending','Tashkent','2026-05-08 12:41:55.929091');
INSERT INTO bookings VALUES(32,3,1,'2026-05-02 19:00:00.000000','2026-05-03 19:00:00.000000',7000000.0,'pending','Tashkent','2026-05-08 12:45:47.527406');
INSERT INTO bookings VALUES(33,3,1,'2026-05-25 19:00:00.000000','2026-05-27 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 12:46:54.996204');
INSERT INTO bookings VALUES(34,3,1,'2026-05-25 19:00:00.000000','2026-05-27 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 12:48:13.493638');
INSERT INTO bookings VALUES(35,3,1,'2026-05-09 19:00:00.000000','2026-05-10 19:00:00.000000',7000000.0,'pending','Tashkent','2026-05-08 12:49:13.928666');
INSERT INTO bookings VALUES(36,3,1,'2026-05-09 19:00:00.000000','2026-05-10 19:00:00.000000',7000000.0,'pending','Tashkent','2026-05-08 12:50:06.578466');
INSERT INTO bookings VALUES(37,4,1,'2026-05-24 19:00:00.000000','2026-05-27 19:00:00.000000',21000000.0,'pending','Tashkent','2026-05-08 12:58:33.578420');
INSERT INTO bookings VALUES(38,1,1,'2026-05-17 19:00:00.000000','2026-05-19 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 13:00:47.608131');
INSERT INTO bookings VALUES(39,1,1,'2026-05-25 19:00:00.000000','2026-05-27 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 13:02:12.340253');
INSERT INTO bookings VALUES(40,1,1,'2026-05-24 19:00:00.000000','2026-05-27 19:00:00.000000',21000000.0,'pending','Tashkent','2026-05-08 13:08:28.108497');
INSERT INTO bookings VALUES(41,1,1,'2026-05-11 19:00:00.000000','2026-05-13 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 13:12:43.075347');
INSERT INTO bookings VALUES(42,1,1,'2026-05-25 19:00:00.000000','2026-05-27 19:00:00.000000',14000000.0,'done','Tashkent','2026-05-08 13:16:02.803820');
INSERT INTO bookings VALUES(43,1,1,'2026-05-11 19:00:00.000000','2026-05-13 19:00:00.000000',14000000.0,'done','Tashkent','2026-05-08 13:39:22.862442');
INSERT INTO bookings VALUES(44,1,1,'2026-05-25 19:00:00.000000','2026-05-27 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 14:06:37.839647');
INSERT INTO bookings VALUES(45,3,1,'2026-05-25 19:00:00.000000','2026-05-27 19:00:00.000000',14000000.0,'pending','Tashkent','2026-05-08 14:08:04.583129');
INSERT INTO bookings VALUES(46,1,1,'2026-05-25 19:00:00.000000','2026-05-27 19:00:00.000000',14000000.0,'done','Tashkent','2026-05-08 14:10:18.632120');
CREATE INDEX ix_complexes_name ON complexes (name);
CREATE INDEX ix_complexes_id ON complexes (id);
CREATE INDEX ix_clients_id ON clients (id);
CREATE UNIQUE INDEX ix_clients_tg_id ON clients (tg_id);
CREATE INDEX ix_apartments_id ON apartments (id);
CREATE INDEX ix_bookings_id ON bookings (id);
COMMIT;
