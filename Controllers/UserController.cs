using mingielewicz_inzynierka.Data;
using mingielewicz_inzynierka.Dtos;
using mingielewicz_inzynierka.Helpers;
using mingielewicz_inzynierka.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace mingielewicz_inzynierka.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _repository;
        private readonly JwtService _jwtService;

        public UserController(IUserRepository repository, JwtService jwtService)
        {
            _repository = repository;
            _jwtService = jwtService;
        }

        // GET: api/Text
        [HttpGet]
        public async Task<ActionResult<List<User>>> GetUsers()
        {
            if (_repository.GetUsers == null)
            {
                return NotFound();
            }

            return _repository.GetUsers();
        }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (_repository.GetById == null)
            {
                return NotFound();
            }
            var user = _repository.GetById(id);

            if (user == null)
            {
                return NotFound();
            }
            return user;
        }

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("register")]
        public IActionResult Register([FromForm] RegisterDto dto)
        {
            var user = new User
            {
                login = dto.login,
                email = dto.email,
                password = BCrypt.Net.BCrypt.HashPassword(dto.password)
            };

            return Created("success", _repository.Create(user));
        }

        [HttpPost("login")]
        public IActionResult Login(LoginDto dto)
        {
            var user = _repository.GetByLogin(dto.login);

            if (user == null) return BadRequest(new { message = "Invalid login or password" });
            if(!BCrypt.Net.BCrypt.Verify(dto.password, user.password))
            {
                return BadRequest(new { message = "Invalid login or password" });
            }

            var jwt = _jwtService.Generate(user.idUser);
            Response.Cookies.Append("jwt", jwt, new CookieOptions
            {
                HttpOnly = true,
            });

            return Ok(new
            {
                message = "success"
            });
        }
        [HttpGet("user")]
        public IActionResult GetUser()
        {
            try
            {
                var jwt = Request.Cookies["jwt"];
                var token = _jwtService.Verify(jwt);
                int userId = int.Parse(token.Issuer);
                var user = _repository.GetById(userId);

                return Ok(user);
            } 
            catch (Exception _)
            {
                return Unauthorized();
            }
        }
        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("jwt");

            return Ok(new
            {
                message = "success"
            });
        }
    }
}
