using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mingielewicz_inzynierka.Models
{
    public class Translation
    {
        [Key]
        public int id { get; set; }
        public int sectionId { get; set; }
        public string translatedText { get; set; }
        public string language { get; set; }
        public int idText { get; set; }
        [ForeignKey("idText")]
        public Text text { get; set; }
        public int idUser { get; set; }
        [ForeignKey("idUser")]
        public User user { get; set; }
    }
}
