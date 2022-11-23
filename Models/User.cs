using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace InzynierkaBackend.Models
{
    public class User
    {
		[Key]
		public int idUser { get; set; }
		public string login { get; set; }
		public string email { get; set; }
		public bool admin { get; set; }
		[JsonIgnore]
		public string password { get; set; }
	}
}
