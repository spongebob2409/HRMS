using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using HRMS.API.Data;
using HRMS.API.Models;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SalaryController : ControllerBase
{
    private readonly AppDbContext _context;
    public SalaryController(AppDbContext context) => _context = context;

    [HttpGet]
    public async Task<IActionResult> GetAll() =>
        Ok(await _context.Salaries.Include(s => s.Employee).ToListAsync());

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id) =>
        Ok(await _context.Salaries.Include(s => s.Employee)
            .FirstOrDefaultAsync(s => s.Id == id));

    [HttpGet("employee/{employeeId}")]
    public async Task<IActionResult> GetByEmployee(int employeeId) =>
        Ok(await _context.Salaries.Where(s => s.EmployeeId == employeeId).ToListAsync());

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] SalaryDto dto)
    {
        // Check employee exists
        var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId);
        if (!employeeExists)
            return BadRequest(new { message = $"Employee with ID {dto.EmployeeId} does not exist" });

        var salary = new Salary {
            EmployeeId = dto.EmployeeId,
            BasicSalary = dto.BasicSalary,
            Bonus = dto.Bonus,
            Deduction = dto.Deduction,
            EffectiveDate = DateTime.Now
        };
        _context.Salaries.Add(salary);
        await _context.SaveChangesAsync();
        return Ok(salary);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] SalaryDto dto)
    {
        // Check employee exists
        var employeeExists = await _context.Employees.AnyAsync(e => e.Id == dto.EmployeeId);
        if (!employeeExists)
            return BadRequest(new { message = $"Employee with ID {dto.EmployeeId} does not exist" });

        var salary = await _context.Salaries.FindAsync(id);
        if (salary == null) return NotFound();
        salary.EmployeeId = dto.EmployeeId;
        salary.BasicSalary = dto.BasicSalary;
        salary.Bonus = dto.Bonus;
        salary.Deduction = dto.Deduction;
        salary.EffectiveDate = DateTime.Now;
        await _context.SaveChangesAsync();
        return Ok(salary);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var salary = await _context.Salaries.FindAsync(id);
        if (salary == null) return NotFound();
        _context.Salaries.Remove(salary);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}

public class SalaryDto
{
    public int EmployeeId { get; set; }
    public decimal BasicSalary { get; set; }
    public decimal Bonus { get; set; }
    public decimal Deduction { get; set; }
}