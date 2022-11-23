using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InzynierkaBackend.Models
{
    public class Text
    {
        [Key]
        public int idText { get; set; }
        public string title { get; set; }
        public string text { get; set; }
        public string textLanguage { get; set; }
        public int idUser { get; set; }
        [ForeignKey("idUser")]
        public User User { get; set; }
    }
}
