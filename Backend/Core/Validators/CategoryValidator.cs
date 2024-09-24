using Backend.Core.Entities;

namespace Backend.Core.Validators;

public class CategoryValidator : Validators<Category>
{
    public CategoryValidator()
    {
        AddRequired(cate => cate.Name);
        AddRequired(cate => cate.CategoryId);
    }
}