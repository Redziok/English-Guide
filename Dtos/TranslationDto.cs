using System.ComponentModel.DataAnnotations;

namespace mingielewicz_inzynierka.Dtos
{
    public class TranslationDto
    {
        public int idTranslation { get; set; }
        public string translatedText { get; set; }
        public string translationLanguage { get; set; }
        public int idText { get; set; }
        public int idUser { get; set; }
        public string login { get; set; }
    }
}
