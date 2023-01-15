using System.ComponentModel.DataAnnotations;

namespace mingielewicz_inzynierka.Dtos
{
    public class TextDto
    {
        public int idText { get; set; }
        public string title { get; set; }
        public string text { get; set; }
        public string textLanguage { get; set; }
        public int idUser { get; set; }
        public string login { get; set; }
    }
}
