using InzynierkaBackend.Models;

namespace InzynierkaBackend.Data
{
    public interface IUserRepository
    {
        User Create(User user);
        User GetByLogin(string login);
        User GetById(int idUser);
        List<User> GetUsers();
    }
}
