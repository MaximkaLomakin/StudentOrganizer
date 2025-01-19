const { ipcRenderer } = require('electron');

function createModalDialog(title, fields, onSubmit, disabled) {
    const modal = document.getElementById('modalka');
    const modalBS = bootstrap.Modal.getInstance(modal)
    const block = modal.querySelector(".modal-content")
    block.innerHTML = `
                        <div class="modal-header">
                            <h1 class="modal-title fs-5">${title}</h1>
                            <button type="button" class="btn-close cancel" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <form>
                            <div class="modal-body">
                                 ${fields.map(field => field.type === 'select' ? `
                                    <div class="mb-3">
                                        <label class="col-form-label">${field.label}</label>
                                        <select name="${field.name}"  ${field.min ? 'min=' + field.min : ''} ${field.max ? 'max=' + field.max : ''} class="form-select" aria-label="Выберите неделю">
                                            ${field.options.map(option =>
        `<option value="${option.value}">${option.label}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                            `: `
                                    <div class="mb-3">
                                        <label class="col-form-label">${field.label}</label>
                                        <input type="${field.type || 'text'}" ${field.min ? 'min=' + field.min : ''} ${field.max ? 'max=' + field.max : ''} name="${field.name}" class="form-control" ${field.required ? 'required' : ''}>
                                    </div>
                                  `).join('')}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary cancel" data-bs-dismiss="modal">Отмена</button>
                                <button type="submit" ${disabled ? 'disabled' : ''} class="btn btn-primary">Добавить</button>
                            </div>
                        </form>
        `;

    document.body.appendChild(modal);

    const form = modal.querySelector('form');

    form.addEventListener('submit', (e) => {
        modalBS.hide();
        e.preventDefault();
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
    });
};

async function saveData(scheduleData, reminderData, gradeData) {
    const data = {
        schedule: scheduleData,
        reminders: reminderData,
        grades: gradeData
    };
    await ipcRenderer.invoke('save-data', data);
};
async function loadData(scheduleData, scheduleMap, reminderData, reminderList, gradeData, gradeList) {

    const data = await ipcRenderer.invoke('load-data');
    Object.assign(scheduleData, data.schedule);
    renderSchedule(scheduleMap);
    reminderData.push(...data.reminders);
    renderReminders(reminderList);
    gradeData.push(...data.grades);
    renderGrades(gradeList);
};

function getUniqueSubjects(scheduleData) {
    const subjects = new Set();
    const result = [];
    for (const week in scheduleData) {
        const days = scheduleData[week];
        for (const day in days) {
            days[day].forEach(item => {
                if (item.subject) {
                    subjects.add(item.subject.trim());
                }
            });
        }
    }
    subjects.forEach((item, index) => {
        label = value = item;
        result.push({ label, value })
    });
    console.log(scheduleData);
    return (result.length ? result : [{ label: 'Предметы не добавлены', value: '-1' }]);
}

module.exports = { createModalDialog, saveData, loadData, getUniqueSubjects };

