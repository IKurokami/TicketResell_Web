using Backend.Core.Entities;
using FluentValidation;

namespace Backend.Core.Validators
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor(user => user.Username).NotEmpty().WithMessage("Username is required.");
            RuleFor(user => user.Gmail).NotEmpty().EmailAddress().WithMessage("Invalid email address.");
            RuleFor(user => user.Password)
                .NotEmpty().WithMessage("Username is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.")
                .Matches("[0-9]").WithMessage("Password must contain a number.");
        }
    }
}