using mingielewicz_inzynierka.Data;
using mingielewicz_inzynierka.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mingielewicz_inzynierka.Dtos;

namespace InzynierkaBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TextController : ControllerBase
    {
        private readonly DataContext _context;

        public TextController(DataContext context)
        {
            _context = context;
        }

        // GET: api/Text
        [HttpGet]
        public async Task<ActionResult<List<TextDto>>> GetTexts()
        {
            if (_context.Texts == null)
            {
                return NotFound();
            }

            var text = await _context.Texts
                                           .Include(p => p.user)
                                           .Select(p =>
                                           new TextDto
                                           {
                                               id = p.id,
                                               title = p.title,
                                               text = p.text,
                                               language = p.language,
                                               idUser = p.idUser,
                                               login = p.user.login ?? String.Empty
                                           }).OrderByDescending(p => p.id).ToListAsync();

            return text;
        }

        // GET: api/Text/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TextDto>> GetText(int id)
        {
            if (_context.Texts == null)
            {
                return NotFound();
            }
            var text = await _context.Texts
                                    .Where(p => p.id == id)
                                    .Include(p => p.user)
                                    .Select(p =>
                                    new TextDto
                                    {
                                        id = p.id,
                                        title = p.title,
                                        text = p.text,
                                        language = p.language,
                                        idUser = p.idUser,
                                        login = p.user.login ?? String.Empty
                                    }).FirstOrDefaultAsync(p => p.id == id);

            if (text == null)
            {
                return NotFound();
            }
            return text;
        }

        // GET: api/Text/5
        [HttpGet("user={id}")]
        public async Task<ActionResult<List<TextDto>>> GetTextsByUserId(int id)
        {
            if (_context.Texts == null)
            {
                return NotFound();
            }
            var text = await _context.Texts
                                    .Where(p => p.idUser == id)
                                    .Include(p => p.user)
                                    .Select(p =>
                                    new TextDto
                                    {
                                        id = p.id,
                                        title = p.title,
                                        text = p.text,
                                        language = p.language,
                                        idUser = p.idUser,
                                        login = p.user.login ?? String.Empty
                                    }).ToListAsync();

            if (text == null)
            {
                return NotFound();
            }
            return text;
        }

        // POST: api/Text
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Text>> PostText([FromForm] string title, [FromForm] string text, [FromForm] string language, [FromForm] int idUser)
        {
            var texts = new Text();
            texts.title = title;
            texts.text = text;
            texts.language = language;
            texts.idUser = idUser;

            if (_context.Texts == null)
            {
                return Problem("Entity set 'DataContext.Texts'  is null.");
            }
            _context.Texts.Add(texts);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTexts", new { id = texts.id }, texts);
        }

        // PUT: api/Text/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> putText(int id, [FromForm] string title, [FromForm] string text, [FromForm] string textLanguage, [FromForm] int idUser)
        {
            var texts = _context.Texts.FirstOrDefault(p => p.id == id);
            if (id != texts.id)
            {
                return BadRequest();
            }
            texts.id = id;
            texts.title = title;
            texts.text = text;
            texts.idUser = idUser;


            _context.Entry(texts).State = EntityState.Modified;

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

        // DELETE: api/Text/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteText(int id)
        {
            if (_context.Texts == null)
            {
                return NotFound();
            }
            var text = await _context.Texts.FindAsync(id);
            if (text == null)
            {
                return NotFound();
            }

            _context.Texts.Remove(text);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TextExists(int id)
        {
            return (_context.Texts?.Any(e => e.id == id)).GetValueOrDefault();
        }
    }
}
