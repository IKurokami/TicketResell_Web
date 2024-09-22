using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;

namespace Backend.Core.Validators
{
    public interface IValidatorFactory
    {
        IValidator<T> GetValidator<T>();
    }
}