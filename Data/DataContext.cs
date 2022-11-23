using InzynierkaBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace InzynierkaBackend.Data
{
    public class DataContext : DbContext
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>(entity => {
                entity.HasIndex(e => e.login).IsUnique();
                entity.HasIndex(e => e.email).IsUnique();
            });
        }
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Text> Texts { get; set; }
        public DbSet<Translation> Translations { get; set; }
    }
}
