@echo off
echo Starting HRMS...
start cmd /k "cd /d D:\HRMS\HRMS.API && dotnet run" //Start the backend API, adjust the pathif needed
timeout /t 5
start cmd /k "cd /d D:\HRMS\hrms-frontend && ng serve" //Start the frontend, adjust the pathif needed
timeout /t 8
start chrome http://localhost:4200
echo Done! HRMS is running.