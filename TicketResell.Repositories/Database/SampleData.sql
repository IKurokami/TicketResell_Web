-- Inserting sample data into Role table
INSERT INTO [Role] (
    [RoleId], 
    [Rolename], 
    [Description]
)
VALUES
('RO1', 'Admin', 'Administrator with full system access and permissions'),
('RO2', 'Staff', 'Staff member responsible for managing operations'),
('RO3', 'Buyer', 'User with permissions to browse and purchase products'),
('RO4', 'Seller', 'User with permissions to list and sell products');

-- Inserting 10 sample records into SellConfig table
INSERT INTO [SellConfig] (
    [SellConfigId], 
    [Commision]
)
VALUES
('SELLCONFIG001', 1.2), 
('SELLCONFIG002', 1.0), 
('SELLCONFIG003', 0.8), 
('SELLCONFIG004', 3.5), 
('SELLCONFIG005', 5.5), 
('SELLCONFIG006', 4.0), 
('SELLCONFIG007', 6.5), 
('SELLCONFIG008', 3.0), 
('SELLCONFIG009', 7.0), 
('SELLCONFIG010', 4.8);


-- Inserting 10 sample records into User table
INSERT INTO [User] (
    [UserId], 
    [SellConfigId], 
    [Username], 
    [Password], 
    [Status], 
    [CreateDate], 
    [Gmail], 
    [Fullname], 
    [Sex], 
    [Phone], 
    [Address], 
    [Avatar], 
    [Birthday], 
    [Bio], 
    [Verify], 
    [Bank], 
    [BankType], 
    [SellAddress], 
    [Cccd]
)
VALUES
('USER001', 'SELLCONFIG001', 'user1@gmail.com', '1', 1, GETDATE(), 'user1@gmail.com', 'User One', 'Male', '1111111111', 'Address 1', 'USER001', '1990-01-01', 'Bio of user one', 1, 'Bank A', 'Checking', 'Sell Address 1', 'CCCD001'),

('USER002', 'SELLCONFIG002', 'user2@gmail.com', '2', 1, GETDATE(), 'user2@gmail.com', 'User Two', 'Female', '2222222222', 'Address 2', 'USER002', '1992-02-02', 'Bio of user two', 0, 'Bank B', 'Savings', 'Sell Address 2', 'CCCD002'),

('USER003', 'SELLCONFIG003', 'user3@gmail.com', '3', 1, GETDATE(), 'user3@gmail.com', 'User Three', 'Male', '3333333333', 'Address 3', 'USER003', '1993-03-03', 'Bio of user three', 1, 'Bank C', 'Checking', 'Sell Address 3', 'CCCD003'),

('USER004', 'SELLCONFIG004', 'user4@gmail.com', '4', 1, GETDATE(), 'user4@gmail.com', 'User Four', 'Female', '4444444444', 'Address 4', 'USER004', '1994-04-04', 'Bio of user four', 1, 'Bank D', 'Savings', 'Sell Address 4', 'CCCD004'),

('USER005', 'SELLCONFIG005', 'user5@gmail.com', '5', 0, GETDATE(), 'user5@gmail.com', 'User Five', 'Male', '5555555555', 'Address 5', 'USER005', '1995-05-05', 'Bio of user five', 0, 'Bank E', 'Checking', 'Sell Address 5', 'CCCD005'),

('USER006', 'SELLCONFIG006', 'user6@gmail.com', '6', 0, GETDATE(), 'user6@gmail.com', 'User Six', 'Female', '6666666666', 'Address 6', 'USER006', '1996-06-06', 'Bio of user six', 1, 'Bank F', 'Savings', 'Sell Address 6', 'CCCD006'),

('USER007', 'SELLCONFIG007', 'user7@gmail.com', '7', 1, GETDATE(), 'user7@gmail.com', 'User Seven', 'Male', '7777777777', 'Address 7', 'USER007', '1997-07-07', 'Bio of user seven', 1, 'Bank G', 'Checking', 'Sell Address 7', 'CCCD007'),

('USER008', 'SELLCONFIG008', 'user8@gmail.com', '8', 1, GETDATE(), 'user8@gmail.com', 'User Eight', 'Female', '8888888888', 'Address 8', 'USER008', '1998-08-08', 'Bio of user eight', 1, 'Bank H', 'Savings', 'Sell Address 8', 'CCCD008'),

('USER009', 'SELLCONFIG009', 'user9@gmail.com', '9', 0, GETDATE(), 'user9@gmail.com', 'User Nine', 'Male', '9999999999', 'Address 9', 'USER009', '1999-09-09', 'Bio of user nine', 0, 'Bank I', 'Checking', 'Sell Address 9', 'CCCD009'),

('USER010', 'SELLCONFIG010', 'user10@gmail.com', '10', 1, GETDATE(), 'user10@gmail.com', 'User Ten', 'Female', '1010101010', 'Address 10', 'USER010', '2000-10-10', 'Bio of user ten', 1, 'Bank J', 'Savings', 'Sell Address 10', 'CCCD010');


-- Inserting 10 sample records into Category table
INSERT INTO [Category] (
    [CategoryId], 
    [Name], 
    [Description]
)
VALUES
('CAT001', 'Music', 'All genres of music events and concerts.'),
('CAT002', 'Sports', 'Various sports events including football, basketball, and more.'),
('CAT003', 'Theater', 'Live theater performances and plays.'),
('CAT004', 'Festival', 'Cultural and music festivals.'),
('CAT005', 'Conference', 'Business and technology conferences.'),
('CAT006', 'Workshop', 'Educational workshops and seminars.'),
('CAT007', 'Exhibition', 'Art and science exhibitions.'),
('CAT008', 'Comedy', 'Stand-up comedy shows and events.'),
('CAT009', 'Dance', 'Dance performances and ballet shows.'),
('CAT010', 'Magic', 'Magic shows and illusions.');



-- Inserting around 30 sample tickets, with some sellers having multiple tickets
INSERT INTO [Ticket] (
    [TicketId], 
    [SellerId], 
    [Name], 
    [Cost], 
    [Location], 
    [StartDate], 
    [CreateDate], 
    [ModifyDate], 
    [Status], 
    [Image]
)
VALUES
-- USER004 has multiple tickets
('TICKET001', 'USER004', 'Concert A', 100.0, 'Venue A', '2024-11-01 18:00:00', GETDATE(), GETDATE(), 1, 'TICKET001'),
('TICKET002', 'USER004', 'Festival B', 150.0, 'Venue B', '2024-12-05 15:00:00', GETDATE(), GETDATE(), 1, 'TICKET002'),
('TICKET003', 'USER004', 'Sports Event C', 200.0, 'Stadium C', '2024-10-20 20:00:00', GETDATE(), GETDATE(), 1, 'TICKET003'),

-- USER005 has multiple tickets
('TICKET004', 'USER005', 'Theater D', 75.0, 'Theater D', '2024-09-25 19:30:00', GETDATE(), GETDATE(), 1, 'TICKET004'),
('TICKET005', 'USER005', 'Concert E', 125.0, 'Arena E', '2024-11-15 20:00:00', GETDATE(), GETDATE(), 1, 'TICKET005'),
('TICKET006', 'USER005', 'Festival F', 180.0, 'Venue F', '2024-12-01 16:00:00', GETDATE(), GETDATE(), 1, 'TICKET006'),

-- USER006 has multiple tickets
('TICKET007', 'USER006', 'Sports Event G', 250.0, 'Stadium G', '2024-10-30 19:00:00', GETDATE(), GETDATE(), 1, 'TICKET007'),
('TICKET008', 'USER006', 'Theater H', 60.0, 'Theater H', '2024-09-30 19:00:00', GETDATE(), GETDATE(), 1, 'TICKET008'),
('TICKET009', 'USER006', 'Festival I', 175.0, 'Venue I', '2024-12-10 17:00:00', GETDATE(), GETDATE(), 1, 'TICKET009'),

-- USER007 has multiple tickets
('TICKET010', 'USER007', 'Concert J', 200.0, 'Venue J', '2024-11-05 18:30:00', GETDATE(), GETDATE(), 1, 'TICKET010'),
('TICKET011', 'USER007', 'Sports Event K', 300.0, 'Stadium K', '2024-11-20 20:00:00', GETDATE(), GETDATE(), 1, 'TICKET011'),
('TICKET012', 'USER007', 'Theater L', 90.0, 'Theater L', '2024-10-01 19:00:00', GETDATE(), GETDATE(), 1, 'TICKET012'),

-- USER008 has multiple tickets
('TICKET013', 'USER008', 'Concert M', 220.0, 'Venue M', '2024-10-18 18:00:00', GETDATE(), GETDATE(), 1, 'TICKET013'),
('TICKET014', 'USER008', 'Festival N', 190.0, 'Venue N', '2024-11-22 15:00:00', GETDATE(), GETDATE(), 1, 'TICKET014'),

-- USER009 has multiple tickets
('TICKET015', 'USER009', 'Sports Event O', 270.0, 'Stadium O', '2024-11-25 19:00:00', GETDATE(), GETDATE(), 1, 'TICKET015'),
('TICKET016', 'USER009', 'Theater P', 85.0, 'Theater P', '2024-10-15 19:30:00', GETDATE(), GETDATE(), 1, 'TICKET016'),

-- USER010 has multiple tickets
('TICKET017', 'USER010', 'Concert Q', 240.0, 'Venue Q', '2024-11-30 18:00:00', GETDATE(), GETDATE(), 1, 'TICKET017'),
('TICKET018', 'USER010', 'Festival R', 195.0, 'Venue R', '2024-12-03 16:00:00', GETDATE(), GETDATE(), 1, 'TICKET018'),

-- USER001 has multiple tickets
('TICKET019', 'USER001', 'Sports Event S', 280.0, 'Stadium S', '2024-10-20 20:00:00', GETDATE(), GETDATE(), 1, 'TICKET019'),
('TICKET020', 'USER001', 'Theater T', 70.0, 'Theater T', '2024-09-26 19:00:00', GETDATE(), GETDATE(), 1, 'TICKET020'),
('TICKET021', 'USER001', 'Concert U', 130.0, 'Venue U', '2024-12-15 18:30:00', GETDATE(), GETDATE(), 1, 'TICKET021'),

-- Additional tickets for diversity
('TICKET027', 'USER006', 'Theater AA', 90.0, 'Theater AA', '2024-09-28 19:30:00', GETDATE(), GETDATE(), 1, 'TICKET027'),
('TICKET028', 'USER004', 'Sports Event BB', 225.0, 'Stadium BB', '2024-11-19 20:00:00', GETDATE(), GETDATE(), 1, 'TICKET028'),
('TICKET029', 'USER008', 'Concert CC', 175.0, 'Venue CC', '2024-12-08 18:00:00', GETDATE(), GETDATE(), 1, 'TICKET029'),
('TICKET030', 'USER007', 'Festival DD', 155.0, 'Venue DD', '2024-10-14 16:00:00', GETDATE(), GETDATE(), 1, 'TICKET030');


-- Inserting sample data into the [Order] table
INSERT INTO [Order] (
    [OrderId], 
    [BuyerId], 
    [Total], 
    [Date], 
    [Status]
)
VALUES
-- Orders for USER001
('ORD001', 'USER001', 120.50, '2024-09-01 10:15:00', 1),
('ORD002', 'USER001', 250.00, '2024-09-05 12:30:00', 0),
('ORD003', 'USER001', 90.75, '2024-09-10 14:00:00', 0),

-- Orders for USER002
('ORD004', 'USER002', 300.99, '2024-09-01 09:30:00', 0),
('ORD005', 'USER002', 150.25, '2024-09-05 10:45:00', 1),

-- Orders for USER003
('ORD006', 'USER003', 80.00, '2024-09-02 08:15:00', 1),
('ORD007', 'USER003', 200.00, '2024-09-08 16:00:00', 0),

-- Orders for USER004
('ORD008', 'USER004', 175.75, '2024-09-03 13:00:00', 1),
('ORD009', 'USER004', 320.50, '2024-09-09 18:00:00', 0),

-- Orders for USER005
('ORD010', 'USER005', 215.00, '2024-09-02 11:30:00', 0),
('ORD011', 'USER005', 130.00, '2024-09-06 12:00:00', 1),

-- Orders for USER006
('ORD012', 'USER006', 400.99, '2024-09-04 17:45:00', 1),
('ORD013', 'USER006', 260.75, '2024-09-10 14:30:00', 0),

-- Orders for USER007
('ORD014', 'USER007', 190.00, '2024-09-05 12:15:00', 0),
('ORD015', 'USER007', 275.50, '2024-09-07 13:30:00', 1),

-- Orders for USER008
('ORD016', 'USER008', 300.25, '2024-09-04 09:45:00', 0),
('ORD017', 'USER008', 125.75, '2024-09-08 14:30:00', 1),

-- Orders for USER009
('ORD018', 'USER009', 180.00, '2024-09-01 15:30:00', 1),
('ORD019', 'USER009', 200.50, '2024-09-06 10:30:00', 0),

-- Orders for USER010
('ORD020', 'USER010', 240.00, '2024-09-02 18:00:00', 0),
('ORD021', 'USER010', 175.25, '2024-09-09 12:15:00', 1);

-- Inserting sample data into the [OrderDetail] table using TicketId and OrderId
INSERT INTO [OrderDetail] (
    [OrderDetailId], 
    [OrderId], 
    [TicketId], 
    [Price], 
    [Quantity]
)
VALUES
-- Order Details for ORD001
('OD001', 'ORD001', 'TICKET001', 100.0, 2),
('OD002', 'ORD001', 'TICKET002', 150.0, 1),

-- Order Details for ORD002
('OD003', 'ORD002', 'TICKET004', 75.0, 3),

-- Order Details for ORD003
('OD004', 'ORD003', 'TICKET007', 250.0, 1),

-- Order Details for ORD004
('OD005', 'ORD004', 'TICKET006', 180.0, 1),

-- Order Details for ORD005
('OD006', 'ORD005', 'TICKET009', 175.0, 2),
('OD007', 'ORD005', 'TICKET010', 200.0, 1),

-- Order Details for ORD006
('OD008', 'ORD006', 'TICKET011', 300.0, 1),

-- Order Details for ORD007
('OD009', 'ORD007', 'TICKET013', 220.0, 2),

-- Order Details for ORD008
('OD010', 'ORD008', 'TICKET014', 190.0, 1),
('OD011', 'ORD008', 'TICKET015', 270.0, 1),

-- Order Details for ORD009
('OD012', 'ORD009', 'TICKET017', 240.0, 1),

-- Order Details for ORD010
('OD013', 'ORD010', 'TICKET019', 280.0, 2),

-- Order Details for ORD011
('OD014', 'ORD011', 'TICKET020', 70.0, 3),

-- Order Details for ORD012
('OD015', 'ORD012', 'TICKET028', 225.0, 1),

-- Order Details for ORD013
('OD016', 'ORD013', 'TICKET030', 155.0, 1);












