using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Repositories.Config
{
    public class AppConfig
    {
        public string SQLServer { get; set; } = null!;
        public string BaseUrl { get; set; } = null!;
        public string MomoPartnerCode { get; set; } = null!;
        public string MomoAccessKey { get; set; } = null!;
        public string MomoSecretKey { get; set; } = null!;
        public string MomoApiUrl { get; set; } = null!;
    }

}