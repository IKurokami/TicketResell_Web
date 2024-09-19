using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace App.SampleData
{
    public static class AllData
    {
        public static List<User> Users;
        public static List<Transaction> Transactions;
        public static List<Ticket> Tickets;

        public static List<Rating> Ratings;

        public static List<Chat> Chats;

        public static List<Revenue> Revenues;

        public static List<Notification> Notifications;

        public static void LoadSampleData()
        {
            // Sample Users
            Users = new List<User>
            {
                new User
                {
                    UserId = 1, Username = "john_doe", Email = "john@example.com", PhoneNumber = "1234567890",
                    PasswordHash = "hashedpassword1", ProfilePicture = "profile1.jpg", Bio = "Music lover",
                    SocialId = "john123", CreatedAt = DateTime.Now.AddYears(-2), UserType = "Regular", Rating = 4.5,
                    IsVerified = true
                },
                new User
                {
                    UserId = 2, Username = "jane_smith", Email = "jane@example.com", PhoneNumber = "9876543210",
                    PasswordHash = "hashedpassword2", ProfilePicture = "profile2.jpg", Bio = "Concert enthusiast",
                    SocialId = "jane456", CreatedAt = DateTime.Now.AddYears(-1), UserType = "Premium", Rating = 4.8,
                    IsVerified = true
                },
                new User
                {
                    UserId = 3, Username = "mike_johnson", Email = "mike@example.com", PhoneNumber = "5555555555",
                    PasswordHash = "hashedpassword3", ProfilePicture = "profile3.jpg", Bio = "Sports fan",
                    SocialId = "mike789", CreatedAt = DateTime.Now.AddMonths(-6), UserType = "Regular", Rating = 4.2,
                    IsVerified = false
                }
            };

            // Sample Tickets
            Tickets = new List<Ticket>
            {
                new Ticket
                {
                    TicketId = 1, SellerId = 1, Name = "Concert Ticket",
                    EventName = "Rock Festival",
                    EventDate = DateTime.Now.AddMonths(2),
                    EventLocation = "Central Park",
                    TicketImage = "ms-appx:///Assets/TicketLogo.png",
                    Description = "Amazing rock concert", TicketType = "VIP", OriginalPrice = 100.00m,
                    ResalePrice = 150.00m, PaymentMethod = "Credit Card", TicketStatus = "Available",
                    PostedAt = DateTime.Now.AddDays(-5),
                },
                new Ticket
                {
                    TicketId = 2, SellerId = 2, Name = "Football Match",
                    EventName = "Championship Final", EventDate = DateTime.Now.AddMonths(1),
                    EventLocation = "National Stadium", TicketImage = "ms-appx:///Assets/TicketLogo.png",
                    Description = "Exciting football match", TicketType = "General", OriginalPrice = 50.00m,
                    ResalePrice = 75.00m, PaymentMethod = "PayPal", TicketStatus = "Sold",
                    PostedAt = DateTime.Now.AddDays(-10)
                }
            };

            foreach (var ticket in Tickets)
            {
                ticket.Seller = Users.FirstOrDefault(i => i.UserId == ticket.SellerId);
            }

            // Sample Transactions
            Transactions = new List<Transaction>
            {
                new Transaction
                {
                    TransactionId = 1, TicketId = 1, BuyerId = 3, SellerId = 1,
                    TransactionDate = DateTime.Now.AddDays(-2), TotalAmount = 150.00m, PaymentStatus = "Completed",
                    TransferMethod = "Online Transfer"
                },
                new Transaction
                {
                    TransactionId = 2, TicketId = 2, BuyerId = 1, SellerId = 2,
                    TransactionDate = DateTime.Now.AddDays(-1), TotalAmount = 75.00m, PaymentStatus = "Pending",
                    TransferMethod = "Cash"
                }
            };

            // Sample Ratings
            Ratings = new List<Rating>
            {
                new Rating
                {
                    RatingId = 1, TransactionId = 1, UserId = 3, RatingValue = 5,
                    Comment = "Great seller, smooth transaction!", RatedAt = DateTime.Now.AddHours(-12)
                },
                new Rating
                {
                    RatingId = 2, TransactionId = 2, UserId = 1, RatingValue = 4, Comment = "Good experience overall",
                    RatedAt = DateTime.Now.AddHours(-6)
                }
            };

            // Sample Chats
            Chats = new List<Chat>
            {
                new Chat
                {
                    ChatId = 1, SenderId = 1, ReceiverId = 3, Message = "Is the ticket still available?",
                    SentAt = DateTime.Now.AddDays(-3), TicketId = 1
                },
                new Chat
                {
                    ChatId = 2, SenderId = 3, ReceiverId = 1, Message = "Yes, it is!",
                    SentAt = DateTime.Now.AddDays(-3).AddMinutes(5), TicketId = 1
                },
                new Chat
                {
                    ChatId = 3, SenderId = 2, ReceiverId = 1, Message = "Interested in the football ticket",
                    SentAt = DateTime.Now.AddDays(-2), TicketId = 2
                }
            };

            // Sample Notifications
            Notifications = new List<Notification>
            {
                new Notification
                {
                    NotificationId = 1, UserId = 1, Message = "Your ticket has been sold!", NotificationType = "Sale",
                    SentAt = DateTime.Now.AddDays(-2), IsRead = true
                },
                new Notification
                {
                    NotificationId = 2, UserId = 3, Message = "New message received", NotificationType = "Message",
                    SentAt = DateTime.Now.AddHours(-1), IsRead = false
                },
                new Notification
                {
                    NotificationId = 3, UserId = 2, Message = "Your account has been verified",
                    NotificationType = "Account", SentAt = DateTime.Now.AddDays(-5), IsRead = true
                }
            };

            // Sample Revenues
            Revenues = new List<Revenue>
            {
                new Revenue { UserId = 1, TotalIncome = 500.00m, LastUpdated = DateTime.Now.AddDays(-1) },
                new Revenue { UserId = 2, TotalIncome = 750.00m, LastUpdated = DateTime.Now.AddHours(-12) }
            };
        }
    }
}