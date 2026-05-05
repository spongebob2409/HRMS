using Microsoft.EntityFrameworkCore;
using HRMS.API.Models;

namespace HRMS.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Employee> Employees { get; set; }
        public DbSet<Salary> Salaries { get; set; }
        public DbSet<Payroll> Payrolls { get; set; }
        public DbSet<User> Users { get; set; }
    }
}