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

        [HttpGet("text={id}/language={language}/section={section}")]
        public async Task<ActionResult<RatingDto>> GetTranslationsRating(int id, string language, int section)
        {
            if (_context.Ratings == null)
            {
                return NotFound();
            }
            var ratings = await _context.Ratings
                                                .Where(p => p.idText == id && p.translation.language == language && p.translation.sectionId == section)
                                                .Include(p => p.translation)
                                                .GroupBy(p => new { p.idTranslation, p.translation.language, p.idText })
                                                .Select(p =>
                                                new RatingDto
                                                {
                                                    idText = p.Key.idText,
                                                    idTranslation = p.Key.idTranslation,
                                                    language = p.Key.language,
                                                    rating = p.Sum(i => i.rating),
                                                }).FirstOrDefaultAsync();

            if (ratings == null)
            {
                RatingDto temp = new RatingDto
                {
                    rating = 0,
                };
                return temp;
            }
            return ratings;
        }

        [HttpGet("text={id}/language={language}/section={section}/user={idUser}")]
        public async Task<ActionResult<RatingDto>> GetRatingsByUser(int id, string language, int section, int idUser)
        {
            if (_context.Ratings == null)
            {
                return NotFound();
            }
            var ratings = await _context.Ratings
                                                .Where(p => p.idText == id && p.translation.language == language && p.translation.sectionId == section && p.idUser == idUser)
                                                .Include(p => p.translation)
                                                .Select(p => 
                                                new RatingDto
                                                {
                                                    idTranslation = p.idTranslation,
                                                    rating = p.rating,
                                                    idText = p.idText,
                                                    idUser = p.idUser,
                                                    language = p.translation.language ?? String.Empty
                                                }).FirstOrDefaultAsync();

            if (ratings == null)
            {
                RatingDto temp = new RatingDto
                {
                    rating = 0,
                };
                return temp;
            }
            return ratings;
        }

        // POST: api/Rating
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Rating>> PostOrUpdateRating(RatingDto dto)
        {
            var ratings = new Rating
            {
                rating = dto.rating,
                idUser = dto.idUser,
                idTranslation = dto.idTranslation,
                idText = dto.idText
            };

            if (_context.Ratings == null)
            {
                return Problem("Entity set 'DataContext.Ratings'  is null.");
            }
            var existingRating = _context.Ratings.Where(p => p.idUser == dto.idUser && p.idTranslation == dto.idTranslation).FirstOrDefault();
            if (existingRating != null)
            {
                existingRating.rating = dto.rating;
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetRatings", new { id = existingRating.id }, existingRating);
            }
            else
            {
                _context.Ratings.Add(ratings);
                await _context.SaveChangesAsync();
                return CreatedAtAction("GetRatings", new { id = ratings.id }, ratings);
            }
        }
    }
}
