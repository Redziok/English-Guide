using mingielewicz_inzynierka.Data;
using mingielewicz_inzynierka.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mingielewicz_inzynierka.Dtos;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mingielewicz_inzynierka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TranslationController : ControllerBase
    {
        private readonly DataContext _context;

        public TranslationController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Translation
        [HttpGet]
        public async Task<ActionResult<List<TranslationDto>>> GetTranslations()
        {
            if (_context.Translations == null)
            {
                return NotFound();
            }

            var translations = await _context.Translations
                                                          .Include(p => p.user)
                                                          .Include(p => p.text)
                                                          .Select(p => 
                                                          new TranslationDto
                                                          {
                                                              id = p.id,
                                                              translatedText = p.translatedText,
                                                              language = p.language,
                                                              sectionId = p.sectionId,
                                                              idText = p.idText,
                                                              title = p.text.title ?? String.Empty,
                                                              textLanguage = p.text.language ?? String.Empty,
                                                              idUser = p.idUser,
                                                              login = p.user.login ?? String.Empty
                                                          }).ToListAsync();

            return translations;
        }

        // GET: api/Translation/text=5
        [HttpGet("text={id}/language={language}")]
        public async Task<ActionResult<List<TranslationDto>>> GetTranslationByTextId(int id, string language)
        {
            if (_context.Translations == null)
            {
                return NotFound();
            }
            var translation = await _context.Translations
                                                         .Where(p => p.idText == id && p.language == language)
                                                         .Include(p => p.user)
                                                         .Include(p => p.text)
                                                         .Select(p => 
                                                         new TranslationDto
                                                         {
                                                             id = p.id,
                                                             translatedText = p.translatedText,
                                                             language = p.language,
                                                             sectionId = p.sectionId,
                                                             idText = p.idText,
                                                             title = p.text.title ?? String.Empty,
                                                             textLanguage = p.text.language ?? String.Empty,
                                                             idUser = p.idUser,
                                                             login = p.user.login ?? String.Empty
                                                         })
                                                         .ToListAsync();

            if (translation == null)
            {
                return NotFound();
            }
            return translation;
        }

        // GET: api/Translation/user=5
        [HttpGet("user={id}")]
        public async Task<ActionResult<List<TranslationDto>>> GetTranslationByUserId(int id)
        {
            if (_context.Translations == null)
            {
                return NotFound();
            }
            var translation = await _context.Translations
                                                         .Where(p => p.idUser == id)
                                                         .Include(p => p.user)
                                                         .Include(p => p.text)
                                                         .Select(p =>
                                                         new TranslationDto
                                                         {
                                                             id = p.id,
                                                             translatedText = p.translatedText,
                                                             language = p.language,
                                                             sectionId = p.sectionId,
                                                             idText = p.idText,
                                                             title = p.text.title ?? String.Empty,
                                                             textLanguage = p.text.language ?? String.Empty,
                                                             idUser = p.idUser
                                                         })
                                                         .ToListAsync();

            if (translation == null)
            {
                return NotFound();
            }
            return translation;
        }

        // POST: api/Translation
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Translation>> PostTranslation(TranslationDto dto)
        {
            var translations = new Translation
            {
                translatedText = dto.translatedText,
                language = dto.language,
                idText = dto.idText,
                idUser = dto.idUser,
                sectionId = dto.sectionId
            };

            if (_context.Translations == null)
            {
                return Problem("Entity set 'DataContext.Translations'  is null.");
            }
            _context.Translations.Add(translations);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTranslations", new { id = translations.id }, translations);
        }

        // PUT: api/Translation/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> putTranslation(int id, [FromForm] string translatedText, [FromForm] string language, [FromForm] int idText, [FromForm] int idUser, [FromForm] int sectionId)
        {
            var translations = _context.Translations.FirstOrDefault(p => p.id == id);
            if (id != translations.id)
            {
                return BadRequest();
            }
            translations.translatedText = translatedText;
            translations.language = language;
            translations.idText = idText;
            translations.idUser = idUser;
            translations.sectionId = sectionId;


            _context.Entry(translations).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TranslationExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }

        // DELETE: api/Translation/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTranslation(int id)
        {
            if (_context.Translations == null)
            {
                return NotFound();
            }
            var translation = await _context.Translations.FindAsync(id);
            if (translation == null)
            {
                return NotFound();
            }

            _context.Translations.Remove(translation);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TranslationExists(int id)
        {
            return (_context.Translations?.Any(e => e.id == id)).GetValueOrDefault();
        }
    }
}
