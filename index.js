let todoItemsCont = document.getElementById("todoItemsContainer");
let addButton = document.getElementById("addBtn");
let archiveBtnEl = document.getElementById('archiveBtns');
let trashBtnEl = document.getElementById("trashBtns");
let searchItemsEl = document.getElementById("searchItemsId");
let saveButtonEl = document.getElementById("saveButtonItem");

function getListFromLocalStorage() {
    let stringifiedList = localStorage.getItem("listItems");
    let parsedTodoList = JSON.parse(stringifiedList);
    if (parsedTodoList === null) {
      return [];
    } else {
      return parsedTodoList;
    }
}


let listItems = getListFromLocalStorage();
let itemsCount = listItems.length;

let deletedList = [];

let archivedListActive = false;
let deletedListActive = false;

saveButtonEl.addEventListener("click", function() {
    console.log("Save");
    localStorage.setItem("listItems", JSON.stringify(listItems));
    
})


searchItemsEl.addEventListener("input", function(event) {
    const searchedItem = searchItemsEl.value.toLowerCase();

    const searchedItemsList = listItems.filter(item => (
        item.title.toLowerCase().includes(searchedItem)
    ))

    todoItemsCont.innerHTML = "";
    for(let item of searchedItemsList) {
        createNewItem(item);
    }
})

archiveBtnEl.addEventListener('click', function() {
    let archivedListItems = listItems.filter(item => item.isStarred);
    if (archivedListActive === false) {
        todoItemsCont.innerHTML = "";
        for (let item of archivedListItems) {
            createNewItem(item);
        }
        archiveBtnEl.classList.add("newClasss");
        archivedListActive = true;
    }
    else {
        todoItemsCont.innerHTML = "";
        for(let item of listItems) {
            createNewItem(item);
        }
        archiveBtnEl.classList.remove("newClasss");
        archivedListActive = false;
    }
});

trashBtnEl.addEventListener("click", function() {
    if (deletedListActive === false) {
        todoItemsCont.innerHTML = "";
        for (let item of deletedList) {
            createNewItem(item);
        }
        trashBtnEl.classList.add("newClasss");
        deletedListActive = true;
    }
    else {
        todoItemsCont.innerHTML = "";
        for(let item of listItems) {
            createNewItem(item);
        }
        trashBtnEl.classList.remove("newClasss");
        deletedListActive = false;
    }

})


function deleteTodoItem(todoId) {
    // Find the element in the DOM and remove it
    let deletedItemEl = document.getElementById(todoId);
    if (deletedItemEl) {
        deletedItemEl.parentNode.removeChild(deletedItemEl);
    } else {
        console.error('Element with ID ' + todoId + ' not found in the DOM.');
        return; // Exit function if element not found
    }

    // Find index of the item in listItems array
    let deletedItemIndex = listItems.findIndex(function(eachItem) {
        let eachTodoId = "todo" + eachItem.uniqueNo;
        return eachTodoId === todoId;
    });

    // Check if item was found in listItems array
    if (deletedItemIndex !== -1) {
        // Push the deleted item to deletedList array
        deletedList.push(listItems[deletedItemIndex]);

        // Remove the item from listItems array
        listItems.splice(deletedItemIndex, 1);
    } else {
        console.error('Item with ID ' + todoId + ' not found in listItems array.');
    }
}

function onClickedStar(starId, todoId) {
    let starredTodoItem = document.getElementById(starId);
    let clickedStarItemIndex = listItems.findIndex(function(eachItem) {
        let eachTodoId = "todo" + eachItem.uniqueNo;
        if(eachTodoId === todoId) {
            return true;
        }
        else {
            return false;
        }
    });

    let starredObject = listItems[clickedStarItemIndex];
    if (starredObject.isStarred) {
        starredObject.isStarred = false;
        starredTodoItem.src = "https://assets.ccbp.in/frontend/react-js/appointments-app/star-img.png";
    } 
    else {
        starredObject.isStarred = true;
        starredTodoItem.src = "https://assets.ccbp.in/frontend/react-js/appointments-app/filled-star-img.png";
    }

}


function createNewItem(todo) {
    let todoId = "todo" + todo.uniqueNo;
    let starId = "star" + todo.uniqueNo
    let starUrl = null;
    if(todo.isStarred) {
        starUrl = "https://assets.ccbp.in/frontend/react-js/appointments-app/filled-star-img.png"
    } 
    else {
        starUrl = "https://assets.ccbp.in/frontend/react-js/appointments-app/star-img.png"
    }

    let todoElement = document.createElement("li");
    todoElement.classList.add("todoItemStyle");
    todoElement.id = todoId;
    todoItemsCont.appendChild(todoElement);

    let box1El = document.createElement("div");
    box1El.classList.add("box11Style");
    todoElement.appendChild(box1El)

    let headingElement = document.createElement("h1");
    headingElement.textContent = todo.title;
    headingElement.classList.add("titleStyle");
    box1El.appendChild(headingElement);

    let starImageEl = document.createElement("img");
    starImageEl.src = starUrl;
    starImageEl.classList.add("starImage");
    starImageEl.setAttribute("id", starId);

    starImageEl.onclick = function() {
        onClickedStar(starId, todoId);
    }
    box1El.appendChild(starImageEl);

    let box2El = document.createElement("div");
    box2El.classList.add("box22Style");
    todoElement.appendChild(box2El);

    let paragraphElement = document.createElement("p");
    paragraphElement.textContent = todo.text;
    paragraphElement.classList.add("paraCommentsStyle");
    box2El.appendChild(paragraphElement);

    let deleteImageEl = document.createElement("img");
    deleteImageEl.src = "https://static-00.iconduck.com/assets.00/delete-icon-1877x2048-1t1g6f82.png";
    deleteImageEl.classList.add("deleteIconStyle");
    deleteImageEl.onclick = function() {
        deleteTodoItem(todoId);
    }
    box2El.appendChild(deleteImageEl);

}


function onAddTodo() {
    let userInputTitleElement = document.getElementById("titleInput");
    let userTitle = userInputTitleElement.value;
    let userCommentsElement = document.getElementById("comment");
    let userComments = userCommentsElement.value;

    if (userTitle === "") {
        alert("Enter Title");
        return;
    }

    if (userComments === "") {
        alert("Enter a Note");
        return;
    }

    itemsCount = itemsCount + 1;

    let newTodoItem = {
        title: userTitle,
        text: userComments,
        uniqueNo: itemsCount,
        isStarred: false,
        isdeleted: false
    }


    listItems.push(newTodoItem);
    
    createNewItem(newTodoItem);    
    userInputTitleElement.value = "";
    userCommentsElement.value = "";

}

addButton.onclick = function() {
    onAddTodo();
}

for (let item of listItems) {
    if(item.isdeleted !== true) {
        createNewItem(item);
    }
}