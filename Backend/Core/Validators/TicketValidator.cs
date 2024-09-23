using Backend.Core.Entities;
using FluentValidation;

namespace Backend.Validators;

public class TicketValidator : AbstractValidator<Ticket>
{
    public TicketValidator()
    {
        RuleFor(ticket => ticket.Name).NotEmpty().WithMessage("Name is required");
        RuleFor(ticket => ticket.Cost).NotEmpty().WithMessage("Cost is required");
        RuleFor(ticket => ticket.Location).NotEmpty().WithMessage("Location is required");
        RuleFor(ticket => ticket.StartDate).NotEmpty().WithMessage("Start date is required");
    }
}