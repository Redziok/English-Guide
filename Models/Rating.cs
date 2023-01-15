using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace mingielewicz_inzynierka.Models
{
    public class Rating
    {
        [Key]
        public int idRating { get; set; }
        [Range(-1, 1)]
        public int ratingValue { get; set; }
        public int idUser { get; set; }
        [ForeignKey("idUser")]
        public User user { get; set; }
        public int idTranslation { get; set; }
        [ForeignKey("idTranslation")]
        public Translation translation { get; set; }
        public int idText { get; set; }
        [ForeignKey("idText")]
        public Text text { get; set; }
    }
}
