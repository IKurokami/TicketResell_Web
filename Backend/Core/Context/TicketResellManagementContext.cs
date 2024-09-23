using System;
using System.Collections.Generic;
using Backend.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Core.Context;

public partial class TicketResellManagementContext : DbContext
{
    public TicketResellManagementContext()
    {
    }

    public TicketResellManagementContext(DbContextOptions<TicketResellManagementContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Order?> Orders { get; set; }

    public virtual DbSet<OrderDetail?> OrderDetails { get; set; }

    public virtual DbSet<Revenue> Revenues { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SellConfig> SellConfigs { get; set; }

    public virtual DbSet<Ticket> Tickets { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Name=SQLServer");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Category__19093A0BEBBEB954");

            entity.ToTable("Category");

            entity.Property(e => e.CategoryId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Name).HasMaxLength(255);
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.OrderId).HasName("PK__Order__C3905BCF6786352F");

            entity.ToTable("Order");

            entity.HasIndex(e => e.BuyerId, "IX_Order_BuyerId");

            entity.Property(e => e.OrderId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.BuyerId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Buyer).WithMany(p => p.Orders)
                .HasForeignKey(d => d.BuyerId)
                .HasConstraintName("FK__Order__BuyerId__4222D4EF");
        });

        modelBuilder.Entity<OrderDetail>(entity =>
        {
            entity.HasKey(e => e.OrderDetailId).HasName("PK__OrderDet__D3B9D36C61677EDA");

            entity.ToTable("OrderDetail");

            entity.HasIndex(e => e.OrderId, "IX_OrderDetail_OrderId");

            entity.HasIndex(e => e.TicketId, "IX_OrderDetail_TicketId");

            entity.Property(e => e.OrderDetailId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.OrderId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.TicketId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("FK__OrderDeta__Order__4AB81AF0");

            entity.HasOne(d => d.Ticket).WithMany(p => p.OrderDetails)
                .HasForeignKey(d => d.TicketId)
                .HasConstraintName("FK__OrderDeta__Ticke__4BAC3F29");
        });

        modelBuilder.Entity<Revenue>(entity =>
        {
            entity.HasKey(e => e.RevenueId).HasName("PK__Revenue__275F16DD1765A79B");

            entity.ToTable("Revenue");

            entity.HasIndex(e => e.SellerId, "IX_Revenue_SellerId");

            entity.Property(e => e.RevenueId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Revenue1).HasColumnName("Revenue");
            entity.Property(e => e.SellerId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Type)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Seller).WithMany(p => p.Revenues)
                .HasForeignKey(d => d.SellerId)
                .HasConstraintName("FK__Revenue__SellerI__44FF419A");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Role__8AFACE1AE4BFB3F2");

            entity.ToTable("Role");

            entity.Property(e => e.RoleId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Description).IsUnicode(false);
            entity.Property(e => e.Rolename)
                .HasMaxLength(100)
                .IsUnicode(false);
        });

        modelBuilder.Entity<SellConfig>(entity =>
        {
            entity.HasKey(e => e.SellConfigId).HasName("PK__SellConf__42545BD905ACD877");

            entity.ToTable("SellConfig");

            entity.Property(e => e.SellConfigId)
                .HasMaxLength(50)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Ticket>(entity =>
        {
            entity.HasKey(e => e.TicketId).HasName("PK__Ticket__712CC607A2C872D9");

            entity.ToTable("Ticket");

            entity.HasIndex(e => e.SellerId, "IX_Ticket_SellerId");

            entity.Property(e => e.TicketId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Image)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Location).HasMaxLength(255);
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.SellerId)
                .HasMaxLength(50)
                .IsUnicode(false);

            entity.HasOne(d => d.Seller).WithMany(p => p.Tickets)
                .HasForeignKey(d => d.SellerId)
                .HasConstraintName("FK__Ticket__SellerId__47DBAE45");

            entity.HasMany(d => d.Categories).WithMany(p => p.Tickets)
                .UsingEntity<Dictionary<string, object>>(
                    "TicketCategory",
                    r => r.HasOne<Category>().WithMany()
                        .HasForeignKey("CategoryId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__TicketCat__Categ__5165187F"),
                    l => l.HasOne<Ticket>().WithMany()
                        .HasForeignKey("TicketId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__TicketCat__Ticke__5070F446"),
                    j =>
                    {
                        j.HasKey("TicketId", "CategoryId").HasName("PK__TicketCa__D0BC55A783CF062B");
                        j.ToTable("TicketCategory");
                        j.HasIndex(new[] { "CategoryId" }, "IX_TicketCategory_CategoryId");
                        j.IndexerProperty<string>("TicketId")
                            .HasMaxLength(50)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("CategoryId")
                            .HasMaxLength(50)
                            .IsUnicode(false);
                    });
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__User__1788CC4CA0A0D49E");

            entity.ToTable("User");

            entity.HasIndex(e => e.SellConfigId, "IX_User_SellConfigId");

            entity.Property(e => e.UserId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Address).HasMaxLength(255);
            entity.Property(e => e.Avatar)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Bank)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.BankType)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Cccd)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Fullname).HasMaxLength(255);
            entity.Property(e => e.Gmail)
                .HasMaxLength(100)
                .IsUnicode(false);
            entity.Property(e => e.Password).HasMaxLength(255);
            entity.Property(e => e.Phone)
                .HasMaxLength(20)
                .IsUnicode(false);
            entity.Property(e => e.SellAddress).HasMaxLength(255);
            entity.Property(e => e.SellConfigId)
                .HasMaxLength(50)
                .IsUnicode(false);
            entity.Property(e => e.Sex).HasMaxLength(10);
            entity.Property(e => e.Username)
                .HasMaxLength(100)
                .IsUnicode(false);

            entity.HasOne(d => d.SellConfig).WithMany(p => p.Users)
                .HasForeignKey(d => d.SellConfigId)
                .HasConstraintName("FK__User__SellConfig__398D8EEE");

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "UserRole",
                    r => r.HasOne<Role>().WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__UserRole__RoleId__3F466844"),
                    l => l.HasOne<User>().WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK__UserRole__UserId__3E52440B"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId").HasName("PK__UserRole__AF2760AD6F602E5A");
                        j.ToTable("UserRole");
                        j.HasIndex(new[] { "RoleId" }, "IX_UserRole_RoleId");
                        j.IndexerProperty<string>("UserId")
                            .HasMaxLength(50)
                            .IsUnicode(false);
                        j.IndexerProperty<string>("RoleId")
                            .HasMaxLength(50)
                            .IsUnicode(false);
                    });
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
