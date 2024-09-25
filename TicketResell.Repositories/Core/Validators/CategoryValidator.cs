using TicketResell.Repository.Core.Entities;

namespace TicketResell.Repository.Core.Validators;

public class CategoryValidator : Validators<Category>
{
    public CategoryValidator()
    {
        AddRequired(cate => cate.Name);
        AddRequired(cate => cate.CategoryId);
    }
}