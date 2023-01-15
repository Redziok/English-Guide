namespace mingielewicz_inzynierka.Dtos
{
    public class RatingDto
    {
        public int ratingValue { get; set; }
        public int idUser { get; set; }
        public int idTranslation { get; set; }
        public string translationLanguage { get; set; }
        public int idText { get; set; }
    }
}
