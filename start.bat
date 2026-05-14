@echo off
echo Starting HRMS...
start cmd /k "cd /d F:\HRMS\HRMS\HRMS.API && dotnet run" 
timeout /t 5 /nobreak 
start cmd /k "cd /d F:\HRMS\HRMS\hrms-frontend && ng serve"
timeout /t 8 /nobreak
start chrome http://localhost:4200
echo Done! HRMS is running.