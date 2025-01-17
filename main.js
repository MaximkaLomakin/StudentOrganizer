document.addEventListener('DOMContentLoaded', function () {
    const scheduleList = document.getElementById('schedule-list');
    const reminderList = document.getElementById('reminder-list');
    const reminderData = [];
    const scheduleData = {
        1: { // ������ ������
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
        },
        2: { // ������ ������
            monday: [],
            tuesday: [],
            wednesday: [],
            thursday: [],
            friday: [],
            saturday: [],
        },
    };
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


    document.getElementById('add-schedule').addEventListener('click', () => {
        createModalDialog('�������� �������', [
            { label: '�������� �������', name: 'subject', required: true },
            {
                label: '���� ������', name: 'day', type: 'select', required: true, options: [
                    { value: 'monday', label: '�����������' },
                    { value: 'tuesday', label: '�������' },
                    { value: 'wednesday', label: '�����' },
                    { value: 'thursday', label: '�������' },
                    { value: 'friday', label: '�������' },
                    { value: 'saturday', label: '�������' },
                ]
            },
            { label: '������� ������� (��������, ����� ����)', name: 'order', required: true, type: 'number' },
            {
                label: '����� ������', name: 'week', required: true, type: 'select', options: [
                    { value: '1', label: '������ ������' },
                    { value: '2', label: '������ ������' },
                ]
            },
            { label: '����������', name: 'notes', required: false, type: 'text' }
        ], ({ subject, day, order, week, notes}) => {
            if (scheduleData[week][day]) {
                scheduleData[week][day].push({ subject, notes, order });
                scheduleData[week][day].sort((a, b) => a.order - b.order); // ��������� ������� �� �������
                renderSchedule();
            }
        });
    });

    document.getElementById('add-reminder').addEventListener('click', () => {
        createModalDialog('�������� �����������', [
            { label: '�����������', name: 'reminder', required: true },
            { label: '������� (����)', name: 'deadline', type: 'date', required: true },
        ], ({ reminder, deadline }) => {
            reminderData.push({ reminder, deadline});
            renderReminders();
        });
    });

    function createModalDialog(title, fields, onSubmit) {
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
                                        <select name="${field.name}" class="form-select" aria-label="�������� ������">
                                            ${field.options.map(option =>
            `<option value="${option.value}">${option.label}</option>
                                            `).join('')}
                                        </select>
                                    </div>
                            `: `
                                    <div class="mb-3">
                                        <label class="col-form-label">${field.label}</label>
                                        <input type="${field.type || 'text'}" name="${field.name}" class="form-control" ${field.required ? 'required' : ''}>
                                    </div>
                                  `).join('')}
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary cancel" data-bs-dismiss="modal">������</button>
                                <button type="submit" class="btn btn-primary">��������</button>
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

    const renderReminders = () => {
        if (!reminderData.length) {
            reminderList.innerHTML = '<div class="text-center fw-bold">����������� �����������.</div>';
            return;
        }
        reminderList.innerHTML = '';
        reminderData.sort((a, b) => new Date(a.deadline) - new Date(b.deadline)); // ��������� �� ����

        const table = document.createElement('table');
        table.className = 'table table-hover';
        const thead = document.createElement('thead');
        thead.innerHTML = `<tr><th>�����������</th><th>�������</th><th>��������</th></tr>`;
        table.appendChild(thead);

        const tbody = document.createElement('tbody');

        reminderData.forEach(reminder => {
            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = reminder.reminder;
            row.appendChild(titleCell);

            const dateCell = document.createElement('td');
            dateCell.textContent = reminder.deadline;
            row.appendChild(dateCell);

            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
            deleteButton.classList.add('btn', 'btn-primary');
            deleteButton.addEventListener('click', () => {
                const index = reminderData.indexOf(reminder);
                if (index > -1) reminderData.splice(index, 1);
                renderReminders(); // ��������� �����������
            });
            actionsCell.appendChild(deleteButton);
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        reminderList.appendChild(table);
    };

    const renderSchedule = () => {
        console.log(scheduleData);
        console.log(scheduleList);
        console.log(scheduleMap);
        [1, 2].forEach(week => { // ������� ����� ������
            Object.keys(scheduleMap[week]).forEach(day => {
                const container = scheduleMap[week][day];
                if (!scheduleData[week][day].length) {
                    container.innerHTML = '<div class="fw-bold">���������� �� ������.</div>';
                    return;
                }
                container.innerHTML = ''; // ������� ���������
                scheduleData[week][day].forEach(item => {
                    const block = document.createElement('div');
                    block.className = 'schedule-item';
                    block.classList.add('d-flex', 'justify-content-between');
                    block.textContent = `${item.order}. ${item.subject} ${item.notes ? `- ${item.notes}` :``}`
                    block.setAttribute('data-order', item.order);
                     
                    const deleteButton = document.createElement('button');
                    deleteButton.innerHTML = '<i class="bi bi-trash"/>';
                    deleteButton.classList.add('btn', 'btn-outline-danger', 'btn-sm');
                    deleteButton.addEventListener('click', () => {
                        scheduleData[week][day] = scheduleData[week][day].filter(i => i !== item);
                        renderSchedule(); // ��������� ����������
                    });
                    block.appendChild(deleteButton);

                    container.appendChild(block);
                });
            });
        });
    };
    renderSchedule();
    renderReminders();
});