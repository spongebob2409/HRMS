using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HRMS.API.Data;
using HRMS.API.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PayrollController : ControllerBase
{
    private readonly AppDbContext _context;
    public PayrollController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Payrolls.Include(p => p.Employee).ToListAsync());

    [HttpGet("{month}/{year}")]
    public async Task<IActionResult> GetByMonth(int month, int year) =>
        Ok(await _context.Payrolls
            .Include(p => p.Employee)
            .Where(p => p.Month == month && p.Year == year)
            .ToListAsync());

    [HttpPost("generate/{month}/{year}")]
    public async Task<IActionResult> GeneratePayroll(int month, int year)
    {
        var employees = await _context.Employees
            .Include(e => e.Salary)
            .Where(e => e.EmploymentStatus == "Active" && e.Salary != null)
            .ToListAsync();

        if (!employees.Any())
            return BadRequest(new { message = "No active employees with salary found" });

        var generated = new List<Payroll>();

        foreach (var emp in employees)
        {
            bool exists = await _context.Payrolls
                .AnyAsync(p => p.EmployeeId == emp.Id && p.Month == month && p.Year == year);
            if (exists) continue;

            decimal gross = emp.Salary!.BasicSalary + emp.Salary.Bonus - emp.Salary.Deduction;
            decimal tax = gross * 0.10m;
            decimal net = gross - tax;

            generated.Add(new Payroll {
                EmployeeId = emp.Id,
                Month = month,
                Year = year,
                GrossSalary = gross,
                TaxDeduction = tax,
                NetSalary = net,
                GeneratedDate = DateTime.Now
            });
        }

        _context.Payrolls.AddRange(generated);
        await _context.SaveChangesAsync();
        return Ok(new { message = $"{generated.Count} payrolls generated", data = generated });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var payroll = await _context.Payrolls.FindAsync(id);
        if (payroll == null) return NotFound();
        _context.Payrolls.Remove(payroll);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}