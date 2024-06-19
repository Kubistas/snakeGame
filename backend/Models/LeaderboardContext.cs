using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace SnakeGameBackend2.Models
{
    public class LeaderboardContext : DbContext
    {
        public LeaderboardContext(DbContextOptions<LeaderboardContext> options) : base(options)
        {
        }

        public DbSet<LeaderboardEntry> LeaderboardEntries { get; set; }
    }

    public class LeaderboardEntry
    {
        public int Id { get; set; }

        [Required]
        public string PlayerName { get; set; }

        [Range(0, int.MaxValue)]
        public int Score { get; set; }
    }
}