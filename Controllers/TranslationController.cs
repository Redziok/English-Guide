using InzynierkaBackend.Data;
using InzynierkaBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace InzynierkaBackend.Controllers
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
        public async Task<ActionResult<List<Translation>>> GetTranslations()
        {
            if (_context.Translations == null)
            {
                return NotFound();
            }

            return await _context.Translations.ToListAsync();
        }

        // GET: api/Translation/5
        [HttpGet("{id}")]
        public async Task<ActionResult<List<Translation>>> GetTranslationByTextId(int id)
        {
            if (_context.Translations == null)
            {
                return NotFound();
            }
            var translation = await _context.Translations
                                                         .Where(p => p.idText == id).Include(p => p.Text)
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
        public async Task<ActionResult<Translation>> PostTranslation([FromForm] string translatedText, [FromForm] string translationLanguage, [FromForm] int idText, [FromForm] int idUser)
        {
            var translations = new Translation();
            translations.translatedText = translatedText;
            translations.translationLanguage = translationLanguage;
            translations.idText = idText;
            translations.idUser = idUser;

            if (_context.Translations == null)
            {
                return Problem("Entity set 'DataContext.Translations'  is null.");
            }
            _context.Translations.Add(translations);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTranslations", new { id = translations.idTranslation }, translations);
        }

        // PUT: api/Translation/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> putText(int id, [FromForm] string translatedText, [FromForm] string translationLanguage, [FromForm] int idText, [FromForm] int idUser)
        {
            var translations = _context.Translations.FirstOrDefault(p => p.idTranslation == id);
            if (id != translations.idTranslation)
            {
                return BadRequest();
            }
            translations.translatedText = translatedText;
            translations.translationLanguage = translationLanguage;
            translations.idText = idText;
            translations.idUser = idUser;


            _context.Entry(translations).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TextExists(id))
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
        public async Task<IActionResult> DeleteText(int id)
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

        private bool TextExists(int id)
        {
            return (_context.Translations?.Any(e => e.idTranslation == id)).GetValueOrDefault();
        }
    }
}
