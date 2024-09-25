using Microsoft.Extensions.DependencyInjection;

namespace TicketResell.Repository.Core.Validators
{

    public class ValidatorFactory : IValidatorFactory
    {
        private readonly IServiceProvider _serviceProvider;

        public ValidatorFactory(IServiceProvider serviceProvider)
        {
            _serviceProvider = serviceProvider;
        }

        FluentValidation.IValidator<T> IValidatorFactory.GetValidator<T>()
        {
            return _serviceProvider.GetRequiredService<FluentValidation.IValidator<T>>();
        }
    }
}