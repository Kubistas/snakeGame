using System.ComponentModel.DataAnnotations;

public class User
{
    public int Id { get; set; }

    [Required(ErrorMessage = "Username is required")]
    [StringLength(50, ErrorMessage = "Username length can't be more than 50.")]
    public string Username { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [StringLength(50, ErrorMessage = "Password length can't be more than 50.")]
    public string Password { get; set; }
}
