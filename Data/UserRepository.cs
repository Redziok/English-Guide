using mingielewicz_inzynierka.Models;
using Microsoft.EntityFrameworkCore;

namespace mingielewicz_inzynierka.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;

        public UserRepository(DataContext context)
        {
            _context = context;
        }

        public User Create(User user)
        {
            _context.Users.Add(user);
            user.idUser = _context.SaveChanges();

            return user;
        }

        public User GetByLogin(string login)
        {
            return _context.Users.FirstOrDefault(e => e.login == login);
        }

        public User GetById(int idUser)
        {
            return _context.Users.FirstOrDefault(e => e.idUser == idUser);
        }

        public List<User> GetUsers()
        {
            return _context.Users.ToList();
        }
    }
}
