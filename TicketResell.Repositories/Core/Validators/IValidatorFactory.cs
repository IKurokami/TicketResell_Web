using FluentValidation;

namespace TicketResell.Repository.Core.Validators
{
    public interface IValidatorFactory
    {
        IValidator<T> GetValidator<T>();
    }
}