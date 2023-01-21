using System.ComponentModel.DataAnnotations;

namespace mingielewicz_inzynierka.Dtos
{
    public class TranslationDto
    {
        public int id { get; set; }
        public string translatedText { get; set; }
        public string language { get; set; }
        public int sectionId { get; set; }
        public int idText { get; set; }
        public string textLanguage { get; set; }
        public string title { get; set; }
        public int idUser { get; set; }
        public string login { get; set; }
    }
}
