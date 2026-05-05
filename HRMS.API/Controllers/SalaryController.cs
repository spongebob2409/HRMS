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
    public async Task<IActionResult> Create(Salary salary)
    {
        _context.Salaries.Add(salary);
        await _context.SaveChangesAsync();
        return Ok(salary);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Salary salary)
    {
        if (id != salary.Id) return BadRequest();
        _context.Entry(salary).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
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