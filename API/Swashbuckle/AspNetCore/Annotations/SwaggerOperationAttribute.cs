
namespace Swashbuckle.AspNetCore.Annotations
{
    internal class SwaggerOperationAttribute : Attribute
    {
        public string Summary { get; set; }
        public string Description { get; set; }
    }
}