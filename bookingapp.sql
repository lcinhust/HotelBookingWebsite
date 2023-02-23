create database bookingapp;
use bookingapp;

CREATE TABLE account (
  id int AUTO_INCREMENT primary key,
  email varchar(255) not null,
  password varchar(255) not null,
  type_of_account ENUM ('booker', 'admin') default 'booker'
);

CREATE TABLE type (
  id int PRIMARY KEY auto_increment,
  name varchar(255),
  capacity int
);

CREATE TABLE room (
  id int PRIMARY KEY auto_increment,
  number int,
  type_id int,
  status bool,
  CONSTRAINT FK_TypeID FOREIGN KEY (type_id) references type(id)
);

CREATE TABLE booker (
  id int,
  first_name varchar(50) not null,
  last_name varchar(50) not null,
  birth_date date,
  phone char(10),
  PRIMARY KEY (id),
  CONSTRAINT FK_BookerID FOREIGN KEY (id) references account(id)
);
CREATE TABLE reservation (
  id int PRIMARY KEY auto_increment,
  date_in date,
  date_out date,
  booker_id int,
  description varchar(255) default '',
  status enum('accept','decline','pending','checkin','checkout') default 'pending',
  CONSTRAINT FK_rever_bookerid FOREIGN KEY (booker_id) references booker(id)
);

CREATE TABLE room_reserved (
  reservation_id int,
  room_id int,
  PRIMARY KEY (reservation_id, room_id),
  CONSTRAINT FK_room_reserverd_room_id FOREIGN KEY (room_id) references room(id),
  CONSTRAINT FK_room_reserverd_reservation_id FOREIGN KEY (reservation_id) references reservation(id)
);

CREATE TABLE month_price (
  type_id int,
  month int,
  year int,
  price_each_day int,
  PRIMARY KEY (type_id, month, year),
  CONSTRAINT FK_month_price_type_id FOREIGN KEY (type_id) references type(id)
);

CREATE TABLE payment (
  payment_id int PRIMARY KEY auto_increment,
  payment_date date default '1990-01-01',
  reservation_id int,
  total_price int,
  CONSTRAINT FK_payment_reservation_id FOREIGN KEY (reservation_id) references reservation(id)
);


create trigger description_insert
after insert 
on room_reserved
for each row
update reservation
set description = concat(description,(select number from room where id = new.room_id),' ')
where id = new.reservation_id;

create trigger description_update
after delete 
on room_reserved
for each row
update reservation
set description = replace(description,concat((select number from room where id = old.room_id),' '),'')
where id = old.reservation_id;

CREATE EVENT update_status_event
ON SCHEDULE EVERY 1 DAY
DO

    UPDATE reservation
    SET status = 'decline'
    WHERE status = 'accept' AND date_in < NOW();
    
insert into type(name,capacity)
values 
('single',1),
('double',2),
('triple',3),
('quad',4),
('president',2),
('rooftop',2);
      
insert into room (number,type_id,status)
values 
(201,1,0),
(202,1,0),
(203,2,0),
(204,3,0),
(205,3,0),
(206,1,0),
(207,4,0),
(208,2,0),
(209,1,0),
(301,1,0),
(302,1,0),
(303,2,0),
(304,3,0),
(305,3,0),
(306,1,0),
(307,4,0),
(308,2,0),
(309,1,0),
(401,1,0),
(402,1,0),
(403,2,0),
(404,3,0),
(405,3,0),
(406,1,0),
(407,4,0),
(408,2,0),
(409,1,0),
(501,1,0),
(502,1,0),
(503,2,0),
(504,3,0),
(505,3,0),
(506,1,0),
(507,4,0),
(508,2,0),
(509,5,0),
(601,1,0),
(602,1,0),
(603,2,0),
(604,3,0),
(605,3,0),
(606,1,0),
(607,4,0),
(608,2,0),
(609,5,0),
(701,1,0),
(702,1,0),
(703,2,0),
(704,3,0),
(705,3,0),
(706,1,0),
(707,4,0),
(708,2,0),
(709,5,0),
(801,1,0),
(802,1,0),
(803,2,0),
(804,3,0),
(805,3,0),
(806,1,0),
(807,4,0),
(808,2,0),
(809,5,0),
(901,1,0),
(902,6,0),
(903,2,0),
(904,3,0),
(905,6,0);

insert into month_price(type_id,month,year,price_each_day)
values 
(1,1,2023,100),
(2,1,2023,150),
(3,1,2023,200),
(4,1,2023,250),
(5,1,2023,400),
(6,1,2023,350),
(1,2,2023,100),
(2,2,2023,150),
(3,2,2023,200),
(4,2,2023,250),
(5,2,2023,400),
(6,2,2023,350),
(1,3,2023,100),
(2,3,2023,150),
(3,3,2023,200),
(4,3,2023,250),
(5,3,2023,400),
(6,3,2023,350),
(1,4,2023,200),
(2,4,2023,300),
(3,4,2023,400),
(4,4,2023,500),
(5,4,2023,800),
(6,4,2023,700),
(1,5,2023,100),
(2,5,2023,150),
(3,5,2023,200),
(4,5,2023,250),
(5,5,2023,400),
(6,5,2023,350),
(1,6,2023,100),
(2,6,2023,150),
(3,6,2023,200),
(4,6,2023,250),
(5,6,2023,400),
(6,6,2023,350),
(1,7,2023,100),
(2,7,2023,150),
(3,7,2023,200),
(4,7,2023,250),
(5,7,2023,400),
(6,7,2023,350),
(1,8,2023,100),
(2,8,2023,150),
(3,8,2023,200),
(4,8,2023,250),
(5,8,2023,400),
(6,8,2023,350),
(1,9,2023,100),
(2,9,2023,150),
(3,9,2023,200),
(4,9,2023,250),
(5,9,2023,400),
(6,9,2023,350),
(1,10,2023,100),
(2,10,2023,150),
(3,10,2023,200),
(4,10,2023,250),
(5,10,2023,400),
(6,10,2023,350),
(1,11,2023,100),
(2,11,2023,150),
(3,11,2023,200),
(4,11,2023,250),
(5,11,2023,400),
(6,11,2023,350),
(1,12,2023,100),
(2,12,2023,150),
(3,12,2023,200),
(4,12,2023,250),
(5,12,2023,400),
(6,12,2023,350);

insert into account(email,password,type_of_account)
values ('admin@test.com','admin','admin');





