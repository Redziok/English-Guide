using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using mingielewicz_inzynierka.Dtos;

namespace mingielewicz_inzynierka.Models
{
    public class Text
    {
        [Key]
        public int id { get; set; }
        public string title { get; set; }
        public string text { get; set; }
        public string language { get; set; }
        public int idUser { get; set; }
        [ForeignKey("idUser")]
        public User user { get; set; }
    }
}
