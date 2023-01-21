using System.ComponentModel.DataAnnotations;

namespace mingielewicz_inzynierka.Dtos
{
    public class TextDto
    {
        public int id { get; set; }
        public string title { get; set; }
        public string text { get; set; }
        public string language { get; set; }
        public int idUser { get; set; }
        public string login { get; set; }
    }
}
