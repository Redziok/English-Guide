using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InzynierkaBackend.Models
{
    public class Translation
    {
        [Key]
        public int idTranslation { get; set; }
        public string translatedText { get; set; }
        public string translationLanguage { get; set; }
        public int idText { get; set; }
        [ForeignKey("idText")]
        public Text Text { get; set; }
        public int idUser { get; set; }
        [ForeignKey("idUser")]
        public User User { get; set; }

    }
}
