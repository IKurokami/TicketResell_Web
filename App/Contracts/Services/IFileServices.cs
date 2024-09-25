namespace App.Contracts.Services
{
    public interface IFileServices
    {
        T? Read<T>(string folderPath, string fileName);

        void Save<T>(string folderPath, string fileName, T content);

        void Delete(string folderPath, string? fileName);
    }
}