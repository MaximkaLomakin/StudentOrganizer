const { ipcRenderer } = require('electron');
const { renderGrades, gradeData, addGrade } = require('./modules/grades');
const { reminderData, renderReminders, addReminder } = require('./modules/reminders')
const { scheduleData, renderSchedule, addSchedule } = require('./modules/schedule')
const { createModalDialog, saveData, loadData, getUniqueSubjects } = require('./modules/utils')
const { gradeList, scheduleMap, reminderList, addSchedule_onClick, addGrade_onClick, addReminder_onClick } = require('./modules/ui.js')
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add-schedule').addEventListener('click', addSchedule_onClick);
    document.getElementById('add-reminder').addEventListener('click', addReminder_onClick);
    document.getElementById('add-grade').addEventListener('click', addGrade_onClick);
    loadData(scheduleData, scheduleMap, reminderData, reminderList, gradeData, gradeList);
    window.addEventListener('beforeunload', function () {
        saveData(scheduleData, reminderData, gradeData)
    });
}); 