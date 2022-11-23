using InzynierkaBackend.Data;
using InzynierkaBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
        public async Task<ActionResult<List<Text>>> GetTexts()
        {
            if (_context.Texts == null)
            {
                return NotFound();
            }

            return await _context.Texts.ToListAsync();
        }

        // GET: api/Text/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Text>> GetText(int id)
        {
            if (_context.Texts == null)
            {
                return NotFound();
            }
            var text = _context.Texts.FirstOrDefault(p => p.idText == id);

            if (text == null)
            {
                return NotFound();
            }
            return text;
        }

        // POST: api/Text
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Text>> PostText([FromForm] string title, [FromForm] string text, [FromForm] string textLanguage, [FromForm] int idUser)
        {
            var texts = new Text();
            texts.title = title;
            texts.text = text;
            texts.textLanguage = textLanguage;
            texts.idUser = idUser;

            if (_context.Texts == null)
            {
                return Problem("Entity set 'DataContext.Texts'  is null.");
            }
            _context.Texts.Add(texts);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTexts", new { id = texts.idText }, texts);
        }

        // PUT: api/Text/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> putText(int id, [FromForm] string title, [FromForm] string text, [FromForm] string textLanguage, [FromForm] int idUser)
        {
            var texts = _context.Texts.FirstOrDefault(p => p.idText == id);
            if (id != texts.idText)
            {
                return BadRequest();
            }
            texts.idText = id;
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
            return (_context.Texts?.Any(e => e.idText == id)).GetValueOrDefault();
        }
    }
}
