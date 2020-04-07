//button который будет создавать новую строку
const button = document.querySelector('#button');
button.addEventListener('click', newRow);

//button который удаляет строку
const deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach((item) => {
    item.addEventListener('click', deleteRow);
});

//функция создающая строку
function newRow() {
    const block = document.querySelector('#block-to-do');
    const newRow = document.createElement('li');
    newRow.innerHTML = `${moverSvg}<input class="row-info" type="text">${deleteSvg}`;
    newRow.className = 'row-to-do';
    newRow.draggable = 'true';
    block.appendChild(newRow);
    newRow.childNodes[2].addEventListener('click', deleteRow);
    dragDrop();
}

//функция удаляющая строку
function deleteRow(e) {
    if (!e.target.matches('.delete')) return;
    e.target.parentElement.parentElement.removeChild(e.target.parentElement);
}

//функция меняющая изображение сортировки
const changeSortSvg = (type) => {
    if (type == reverseSort) {
        sortingWrapper.innerHTML = sort;
    }
    else if (type == sort) {
        sortingWrapper.innerHTML = reverseSort;
    }
}

//функция определяющая метод сортировки и вызывающая функцию сменить изображение
const SetButtonSymbol = () => {
    const svg = document.querySelector('svg');
    if (svg.id == 'top-sort') {
        changeSortSvg(sort);
        return true;
    } else {
        changeSortSvg(reverseSort);
        return false;
    }
}

//функция сортировки
sortingClick = (e) => {
    const sortIndex = SetButtonSymbol(e);
    const doList = document.querySelectorAll('li .row-info');
    const list = [];
    doList.forEach((item) => list.push(item.value));
    list.sort();
    if (sortIndex == true) {
        let i = 0;
        doList.forEach((item) => item.value = list[i++]);
    } else if (sortIndex == false) {
        let i = list.length - 1;
        doList.forEach((item) => item.value = list[i--]);
    }
}

//button для сортировки
let sortingWrapper = document.querySelector('.sorting');
sortingWrapper.innerHTML = sort;
sortingWrapper.addEventListener('click', sortingClick);

//draf in drop
function getDragElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.row-to-do:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child }
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element
}

function dragDrop() {
    const container = document.querySelector('#block-to-do');
    const draggables = document.querySelectorAll('.move-area circle');
    draggables.forEach(draggable => {
        draggable.parentNode.parentNode.addEventListener('dragstart', () => {
            draggable.parentNode.parentNode.classList.add('dragging');
        })

        draggable.parentNode.parentNode.addEventListener('dragend', () => {
            draggable.parentNode.parentNode.classList.remove('dragging');
        })
    })

    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!e.target.matches('.move-area')) return
        const afterElement = getDragElement(container, e.clientY);
        const draggable = document.querySelector('.dragging');
        if (afterElement == null) {
            container.appendChild(draggable);
        } else {
            container.insertBefore(draggable, afterElement)
        }
    })

}

dragDrop();
newRow();