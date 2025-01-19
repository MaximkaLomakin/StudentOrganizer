const reminderList = document.getElementById('reminder-list');
const gradeList = document.getElementById('grade-list');


const scheduleMap = {
    1: {
        monday: document.getElementById('schedule-monday-week1'),
        tuesday: document.getElementById('schedule-tuesday-week1'),
        wednesday: document.getElementById('schedule-wednesday-week1'),
        thursday: document.getElementById('schedule-thursday-week1'),
        friday: document.getElementById('schedule-friday-week1'),
        saturday: document.getElementById('schedule-saturday-week1'),
    },
    2: {
        monday: document.getElementById('schedule-monday-week2'),
        tuesday: document.getElementById('schedule-tuesday-week2'),
        wednesday: document.getElementById('schedule-wednesday-week2'),
        thursday: document.getElementById('schedule-thursday-week2'),
        friday: document.getElementById('schedule-friday-week2'),
        saturday: document.getElementById('schedule-saturday-week2'),
    },
};
function addSchedule_onClick() {
    createModalDialog('Добавить занятие', [
        { label: 'Название занятия', name: 'subject', required: true },
        {
            label: 'День недели', name: 'day', type: 'select', required: true, options: [
                { value: 'monday', label: 'Понедельник' },
                { value: 'tuesday', label: 'Вторник' },
                { value: 'wednesday', label: 'Среда' },
                { value: 'thursday', label: 'Четверг' },
                { value: 'friday', label: 'Пятница' },
                { value: 'saturday', label: 'Суббота' },
            ]
        },
        { label: 'Порядок занятия (например, номер пары)', name: 'order', min: 1, max: 12, required: true, type: 'number' },
        {
            label: 'Номер недели', name: 'week', required: true, type: 'select', options: [
                { value: '1', label: 'Первая неделя' },
                { value: '2', label: 'Вторая неделя' },
            ]
        },
        { label: 'Примечание', name: 'notes', required: false, type: 'text' }
    ], ({ subject, day, order, week, notes }) => {
        addSchedule(subject, day, order, week, notes, scheduleMap);
        console.log(scheduleData);
    }, false);
}
function addReminder_onClick() {
    createModalDialog('Добавить напоминание', [
        { label: 'Напоминание', name: 'reminder', required: true },
        { label: 'Дедлайн (дата)', name: 'deadline', type: 'date', min: `${new Date().getFullYear()}-${new Date().getMonth() < 9 ? '0' : ''}${new Date().getMonth() + 1}-${new Date().getDate() < 9 ? '0' : ''}${new Date().getDate()}`, max: `${new Date().getFullYear() + 1}-${new Date().getMonth() < 9 ? '0' : ''}${new Date().getMonth() + 1}-${new Date().getDate() < 9 ? '0' : ''}${new Date().getDate()}`, required: true },
    ], ({ reminder, deadline }) => {
        addReminder(reminder, deadline, reminderList);
    }, false);
}
function addGrade_onClick() {
    createModalDialog('Добавить оценку', [
        { label: 'Предмет', name: 'subject', type: 'select', required: true, options: getUniqueSubjects(scheduleData) },
        { label: 'Оценка', name: 'grade', type: 'number', min: -300, max: 300, required: true },
        { label: 'Примечание', name: 'note', type: 'text', required: false },
    ], ({ subject, grade, note }) => {
        addGrade(subject, grade, note, gradeList);
    }, (getUniqueSubjects(scheduleData)[0].value == -1 ? true : false));
}
module.exports = { gradeList, scheduleMap, reminderList, addSchedule_onClick, addGrade_onClick, addReminder_onClick }