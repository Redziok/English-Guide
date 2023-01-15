using mingielewicz_inzynierka.Models;

namespace mingielewicz_inzynierka.Data
{
    public interface IUserRepository
    {
        User Create(User user);
        User GetByLogin(string login);
        User GetById(int idUser);
        List<User> GetUsers();
    }
}
