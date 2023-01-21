using mingielewicz_inzynierka.Models;
using Microsoft.EntityFrameworkCore;

namespace mingielewicz_inzynierka.Data
{
    public class DataContext : DbContext
    {
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<User>(entity => {
                entity.HasIndex(e => e.login).IsUnique();
                entity.HasIndex(e => e.email).IsUnique();
                entity.Property(e => e.isAdmin).HasDefaultValue(false);
            });
            builder.Entity<Rating>(entity =>
            {
                entity.HasIndex(e => new { e.idUser, e.idTranslation }).IsUnique();
            });

            builder.Entity<Translation>(entity =>
            {
                entity.HasIndex(e => new { e.sectionId, e.language, e.idText }).IsUnique();
            });

            builder.Entity<User>(entity =>
            {
                entity.HasData(new User
                {
                    id = 1,
                    login = "Redziok",
                    email = "Redziok@wp.pl",
                    password = BCrypt.Net.BCrypt.HashPassword("Redziok"),
                    isAdmin = true,
                });
            });
        }

        public DataContext()
        {
            this.ChangeTracker.LazyLoadingEnabled = false;
        }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Text> Texts { get; set; }
        public DbSet<Translation> Translations { get; set; }
        public DbSet<Rating> Ratings { get; set; }
    }
}
