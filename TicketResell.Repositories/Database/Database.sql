-- Create the database
CREATE DATABASE TicketResellManagement;
GO

-- Switch to the new database
USE TicketResellManagement;
GO

-- Create the __EFMigrationsHistory table if it does not exist
IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
GO

-- Create tables
CREATE TABLE [Category] (
    [CategoryId] varchar(50) NOT NULL,
    [Name] nvarchar(255) NULL,
    [Description] nvarchar(max) NULL,
    CONSTRAINT [PK__Category__19093A0BEBBEB954] PRIMARY KEY ([CategoryId])
);
GO

CREATE TABLE [Role] (
    [RoleId] varchar(50) NOT NULL,
    [Rolename] varchar(100) NULL,
    [Description] varchar(max) NULL,
    CONSTRAINT [PK__Role__8AFACE1AE4BFB3F2] PRIMARY KEY ([RoleId])
);
GO

CREATE TABLE [SellConfig] (
    [SellConfigId] varchar(50) NOT NULL,
    [Commision] float NULL,
    CONSTRAINT [PK__SellConf__42545BD905ACD877] PRIMARY KEY ([SellConfigId])
);
GO

CREATE TABLE [User] (
    [UserId] varchar(50) NOT NULL,
    [SellConfigId] varchar(50) NULL,
    [Username] varchar(100) NULL,
    [Password] nvarchar(255) NULL,
    [Status] int NULL,
    [CreateDate] datetime2 NULL,
    [Gmail] varchar(100) NULL,
    [Fullname] nvarchar(255) NULL,
    [Sex] nvarchar(10) NULL,
    [Phone] varchar(20) NULL,
    [Address] nvarchar(255) NULL,
    [Avatar] varchar(255) NULL,
    [Birthday] datetime2 NULL,
    [Bio] nvarchar(max) NULL,
    [Verify] int NULL,
    [Bank] varchar(100) NULL,
    [BankType] varchar(50) NULL,
    [SellAddress] nvarchar(255) NULL,
    [Cccd] varchar(50) NULL,
    CONSTRAINT [PK__User__1788CC4CA0A0D49E] PRIMARY KEY ([UserId]),
    CONSTRAINT [FK__User__SellConfig__398D8EEE] FOREIGN KEY ([SellConfigId]) REFERENCES [SellConfig] ([SellConfigId])
);
GO

CREATE TABLE [Order] (
    [OrderId] varchar(50) NOT NULL,
    [BuyerId] varchar(50) NULL,
    [Total] float NULL,
    [Date] datetime2 NULL,
    [Status] int NULL,
    CONSTRAINT [PK__Order__C3905BCF6786352F] PRIMARY KEY ([OrderId]),
    CONSTRAINT [FK__Order__BuyerId__4222D4EF] FOREIGN KEY ([BuyerId]) REFERENCES [User] ([UserId])
);
GO

CREATE TABLE [Revenue] (
    [RevenueId] varchar(50) NOT NULL,
    [SellerId] varchar(50) NULL,
    [StartDate] datetime2 NULL,
    [EndDate] datetime2 NULL,
    [Revenue] float NULL,
    [Type] varchar(50) NULL,
    CONSTRAINT [PK__Revenue__275F16DD1765A79B] PRIMARY KEY ([RevenueId]),
    CONSTRAINT [FK__Revenue__SellerI__44FF419A] FOREIGN KEY ([SellerId]) REFERENCES [User] ([UserId])
);
GO

CREATE TABLE [Ticket] (
    [TicketId] varchar(50) NOT NULL,
    [SellerId] varchar(50) NULL,
    [Name] nvarchar(255) NULL,
    [Cost] float NULL,
    [Location] nvarchar(255) NULL,
    [StartDate] datetime2 NULL,
    [CreateDate] datetime2 NULL,
    [ModifyDate] datetime2 NULL,
    [Status] int NULL,
    [Image] varchar(255) NULL,
    CONSTRAINT [PK__Ticket__712CC607A2C872D9] PRIMARY KEY ([TicketId]),
    CONSTRAINT [FK__Ticket__SellerId__47DBAE45] FOREIGN KEY ([SellerId]) REFERENCES [User] ([UserId])
);
GO

CREATE TABLE [UserRole] (
    [UserId] varchar(50) NOT NULL,
    [RoleId] varchar(50) NOT NULL,
    CONSTRAINT [PK__UserRole__AF2760AD6F602E5A] PRIMARY KEY ([UserId], [RoleId]),
    CONSTRAINT [FK__UserRole__RoleId__3F466844] FOREIGN KEY ([RoleId]) REFERENCES [Role] ([RoleId]),
    CONSTRAINT [FK__UserRole__UserId__3E52440B] FOREIGN KEY ([UserId]) REFERENCES [User] ([UserId])
);
GO

CREATE TABLE [OrderDetail] (
    [OrderDetailId] varchar(50) NOT NULL,
    [OrderId] varchar(50) NULL,
    [TicketId] varchar(50) NULL,
    [Price] float NULL,
    [Quantity] int NULL,
    CONSTRAINT [PK__OrderDet__D3B9D36C61677EDA] PRIMARY KEY ([OrderDetailId]),
    CONSTRAINT [FK__OrderDeta__Order__4AB81AF0] FOREIGN KEY ([OrderId]) REFERENCES [Order] ([OrderId]),
    CONSTRAINT [FK__OrderDeta__Ticke__4BAC3F29] FOREIGN KEY ([TicketId]) REFERENCES [Ticket] ([TicketId])
);
GO

CREATE TABLE [TicketCategory] (
    [TicketId] varchar(50) NOT NULL,
    [CategoryId] varchar(50) NOT NULL,
    CONSTRAINT [PK__TicketCa__D0BC55A783CF062B] PRIMARY KEY ([TicketId], [CategoryId]),
    CONSTRAINT [FK__TicketCat__Categ__5165187F] FOREIGN KEY ([CategoryId]) REFERENCES [Category] ([CategoryId]),
    CONSTRAINT [FK__TicketCat__Ticke__5070F446] FOREIGN KEY ([TicketId]) REFERENCES [Ticket] ([TicketId])
);
GO

-- Create indexes
CREATE INDEX [IX_Order_BuyerId] ON [Order] ([BuyerId]);
GO

CREATE INDEX [IX_OrderDetail_OrderId] ON [OrderDetail] ([OrderId]);
GO

CREATE INDEX [IX_OrderDetail_TicketId] ON [OrderDetail] ([TicketId]);
GO

CREATE INDEX [IX_Revenue_SellerId] ON [Revenue] ([SellerId]);
GO

CREATE INDEX [IX_Ticket_SellerId] ON [Ticket] ([SellerId]);
GO

CREATE INDEX [IX_TicketCategory_CategoryId] ON [TicketCategory] ([CategoryId]);
GO

CREATE INDEX [IX_User_SellConfigId] ON [User] ([SellConfigId]);
GO

CREATE INDEX [IX_UserRole_RoleId] ON [UserRole] ([RoleId]);
GO

-- Insert initial migration history
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20240918161624_Init', N'8.0.8');
GO

COMMIT;
GO
