let connections = []; // Store connections as [fromEl, toEl, line] in an array

function connect(fromEl, toEl) {
    const line = new LeaderLine(fromEl, toEl);
    connections.push([fromEl, toEl, line]); // Store connection in the array
}

function updateLinesForElement(el) {
    connections.forEach(([fromEl, toEl, line]) => {
        if (fromEl === el || toEl === el) {
            line.position(); // Update the line if it's connected to the dragged element
        }
    });
}


//FILTER THE BIG CONNECTIONS ARRAY BY EXISTING ELEMENTS ONLYYYYY
function ClearConnections(el) {
    console.log(connections)
    connections = connections.filter(connection => {
        if (connection[0] === el || connection[1] === el) {
            connection[2].remove(); // Remove the visual line
            return false; // Exclude this connection from the new array
        }
        return true; // Keep this connection
    });
    console.log (connections)
}


$(document).ready (function (){
    $("#add-workflow-fab").click (function (){
        let WorkFlowName = prompt ("Enter New Work Flow Name")
        if (WorkFlowName === null)
            return 
        if (WorkFlowName === "")
            WorkFlowName = "New Work Flow"

        let DropDownMenu = `<div class="dropdown d-inline ms-2 float-end">
                    <img src ="./three-dots.svg"class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <ul class="dropdown-menu">
                        <li class="edit"><a class="dropdown-item">Edit Work Flow Name</a></li>
                        <li class="delete"><a class="dropdown-item">Delete Work Flow</a></li>
                        <li class="connect"><a class="dropdown-item">Add Connection</a></li>
                        <br>
                        <li class="ms-2">Change color</li>
                        <li><a class="dropdown-item"><input type="color"></input></a></li>
                    </ul>
                    </div>`
        
        let WorkFlowCard = `<div class="card WorkFlowCard d-inline-block">
          <div class="card-header">
            <h5><span>${WorkFlowName}</span> ${DropDownMenu}</h5>
                <ul class="list-group list-group-flush">
                    <li class="list-group-item rounded add-task-button">+ Add Task</li>
                </ul>
            </div>
          </div>`


        $("#workFlow").append(WorkFlowCard)
        $("#workFlow .WorkFlowCard").last().draggable({
            handle:"h5", // Optional: makes only the title draggable
            containment:"parent", //Can be dragged only within the parent
            drag: function () {
                updateLinesForElement(this);
              }
        })
    })


    $("#workFlow").on("click" , ".add-task-button" ,function () {
        let TaskName = prompt("Enter Task Name");
        if (TaskName === null)
            return;
        if (TaskName === "")
            TaskName = "New Task";

        let DropDownMenu = `<div class="dropdown d-inline">
                    <img src ="./three-dots.svg"class="dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <ul class="dropdown-menu">
                        <li class="edit-task"><a class="dropdown-item">Edit Task Name</a></li>
                        <li class="delete-task"><a class="dropdown-item">Delete Task</a></li>
                    </ul>
                    </div>`

        let Task = `<li class="list-group-item mb-2">
        ${DropDownMenu}<span>${TaskName}</span> 
        <input class="form-check-input float-end ms-2" type="checkbox"></input></li>`;

        $(Task).insertBefore($(this));

        $(this).parent().sortable ({
            items:"li:not(.add-task-button)",
            containment: "parent",
            cursor: "move"
        })    
    })

    $("#workFlow").on ("input" , "input[type='color']" , function (){
        $(this).closest(".WorkFlowCard").css ("background-color" , $(this).val())
    })

    $("#workFlow").on ("click" , ".edit" , function (){
        let WorkFlowName = prompt ("Enter New Work Flow Name")
        if (WorkFlowName === null || WorkFlowName === "")
            return

        $(this).closest("h5").children("span").text(WorkFlowName)
    })

    $("#workFlow").on ("click" , ".delete" , function (){
        let decision = confirm ("Are you sure you want to remove "+$(this).closest("h5").children("span").text()+" ?")
        if (decision){
             let el = $(this).closest(".WorkFlowCard").get(0)
             ClearConnections (el)
             el.remove();
            
        }
            
        else
            return
    })

    let from = null;
    let awaitingTarget = false;
    
    $("#workFlow").on("click", ".connect", function (e) {
      e.stopPropagation(); // prevent bubbling just in case
    
      from = $(this).closest(".WorkFlowCard").get(0);
      $(from).css("outline", "2px solid blue");
    
      awaitingTarget = true;
    
      console.log("From set. Awaiting to...");
    });
    
    // Click to choose "to"
    $("#workFlow").on("click", ".WorkFlowCard", function () {
      // If not in connect mode, ignore
      if (!awaitingTarget) return;
    
      const to = $(this).get(0);
    
      if (to === from) {
        //Reset
        $(from).css("outline", "none");
        from = null;
        awaitingTarget = false;
        alert("Cannot connect to the same card.");
        return;
      }
    
      connect(from, to);
      
    
      // Reset
      $(from).css("outline", "none");
      from = null;
      awaitingTarget = false;
    
      console.log("Connection made.");
    });

    $("#workFlow").on ("click" , ".edit-task" , function () {
        let TaskName = prompt ("Enter New Task Name")
        if (TaskName === null || TaskName === "")
            return

        $(this).closest("div").siblings("span").text(TaskName)
    }) 
    
    $("#workFlow").on ("click" , ".delete-task" , function () {
        $(this).closest(".list-group-item").remove()
    }) 
})