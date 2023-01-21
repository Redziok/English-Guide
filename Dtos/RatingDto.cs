namespace mingielewicz_inzynierka.Dtos
{
    public class RatingDto
    {
        public int rating { get; set; }
        public int idUser { get; set; }
        public int idTranslation { get; set; }
        public int sectionId { get; set; }
        public string language { get; set; }
        public int idText { get; set; }
    }
}
