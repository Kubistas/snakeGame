using Microsoft.AspNetCore.Mvc;
using SnakeGameBackend2.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SnakeGameBackend2.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class LeaderboardController : ControllerBase
    {
        private readonly LeaderboardContext _context;

        public LeaderboardController(LeaderboardContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LeaderboardEntry>>> GetLeaderboard()
        {
            var leaderboardEntries = await _context.LeaderboardEntries
                .OrderByDescending(e => e.Score)
                .Take(10)
                .ToListAsync();

            return Ok(leaderboardEntries);
        }

        [HttpPost]
        public async Task<ActionResult<LeaderboardEntry>> PostLeaderboardEntry(LeaderboardEntry entry)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the player already exists
            var existingEntry = await _context.LeaderboardEntries
                .FirstOrDefaultAsync(e => e.PlayerName == entry.PlayerName);

            if (existingEntry != null)
            {
                // Update the existing entry's score if it's higher
                if (entry.Score > existingEntry.Score)
                {
                    existingEntry.Score = entry.Score;
                    _context.LeaderboardEntries.Update(existingEntry);
                }
            }
            else
            {
                _context.LeaderboardEntries.Add(entry);
            }

            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetLeaderboard), new { id = entry.Id }, entry);
        }
    }
}