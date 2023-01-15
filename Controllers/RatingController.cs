using mingielewicz_inzynierka.Data;
using mingielewicz_inzynierka.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mingielewicz_inzynierka.Dtos;

namespace mingielewicz_inzynierka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RatingController : ControllerBase
    {
        private readonly DataContext _context;

        public RatingController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Rating
        [HttpGet]
        public async Task<ActionResult<List<Rating>>> GetRatings()
        {
            if (_context.Ratings == null)
            {
                return NotFound();
            }

            var rating = await _context.Ratings.ToListAsync();

            return rating;
        }

        [HttpGet("text={id}")]
        public async Task<ActionResult<List<RatingDto>>> GetRatingsByTextId(int id)
        {
            if (_context.Ratings == null)
            {
                return NotFound();
            }
            var ratings = await _context.Ratings
                                                .Where(p => p.idText == id)
                                                .Include(p => p.translation)
                                                .GroupBy(p => new { p.idTranslation, p.translation.translationLanguage, p.idText })
                                                .Select(p =>
                                                new RatingDto
                                                {
                                                    idText = p.Key.idText,
                                                    idTranslation = p.Key.idTranslation,
                                                    translationLanguage = p.Key.translationLanguage,
                                                    ratingValue = p.Sum(i => i.ratingValue),
                                                }).ToListAsync();

            if (ratings == null)
            {
                return NotFound();
            }
            return ratings;
        }

        [HttpGet("text={idText}/user={idUser}")]
        public async Task<ActionResult<List<RatingDto>>> GetRatingsByUser(int idText, int idUser)
        {
            if (_context.Ratings == null)
            {
                return NotFound();
            }
            var ratings = await _context.Ratings
                                                .Where(p => p.idText == idText && p.idUser == idUser)
                                                .Include(p => p.translation)
                                                .Select(p => 
                                                new RatingDto
                                                {
                                                    idTranslation = p.idTranslation,
                                                    ratingValue = p.ratingValue,
                                                    idText = p.idText,
                                                    idUser = p.idUser,
                                                    translationLanguage = p.translation.translationLanguage ?? String.Empty
                                                }).ToListAsync();

            if (ratings == null)
            {
                return NotFound();
            }
            return ratings;
        }

        // POST: api/Rating
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Rating>> PostOrUpdateRating([FromForm] int ratingValue,[FromForm] int idUser,[FromForm] int idTranslation,[FromForm] int idText)
        {
            var rating = new Rating();
            rating.ratingValue = ratingValue;
            rating.idUser = idUser;
            rating.idTranslation = idTranslation;
            rating.idText = idText;

            if (_context.Ratings == null)
            {
                return Problem("Entity set 'DataContext.Ratings'  is null.");
            }
            var existingRating = _context.Ratings.Where(p => p.idUser == idUser && p.idTranslation == idTranslation).FirstOrDefault();
            if (existingRating != null)
            {
                existingRating.ratingValue = ratingValue;
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetRatings", new { id = existingRating.idRating }, existingRating);
            }
            else
            {
                _context.Ratings.Add(rating);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetRatings", new { id = rating.idRating }, rating);
            }
        }
    }
}
