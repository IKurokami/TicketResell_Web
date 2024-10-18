using System.Security.Cryptography;
using System.Text;

namespace TicketResell.Services.Services.Crypto;

public class CryptoService : ICryptoService
{
    private readonly string key = "qxdBfW31GnjfHG621DCSquug8bRiFy38";

    public string Decrypt(string cipherText)
    {
        var parts = cipherText.Split(':');
        byte[] iv = Convert.FromHexString(parts[0]);
        byte[] buffer = Convert.FromHexString(parts[1]);

        using (Aes aes = Aes.Create())
        {
            aes.Key = Encoding.UTF8.GetBytes(key);
            aes.IV = iv;

            ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

            using (MemoryStream ms = new MemoryStream(buffer))
            {
                using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                {
                    using (StreamReader sr = new StreamReader(cs))
                    {
                        return sr.ReadToEnd();
                    }
                }
            }
        }
    }
}