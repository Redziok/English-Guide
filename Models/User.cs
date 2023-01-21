using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace mingielewicz_inzynierka.Models
{
    public class User
    {
		[Key]
		public int id { get; set; }
		public string login { get; set; }
		public string email { get; set; }
		public bool isAdmin { get; set; }
		[JsonIgnore]
		public string password { get; set; }
	}
}
