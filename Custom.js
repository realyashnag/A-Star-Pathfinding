//Using JS to build the Grid by Himesh  
var content = document.querySelectorAll(".container")[1];
for (var i = 9; i>0; i--) {
  for (var j = 1; j<10; j++) {
    content.innerHTML = content.innerHTML + '<div class="box" id="b'+j+''+i+'" onclick="update(this.id)" data-h-g-f-parent="[0, 0, 0, null]" data-locked="0"></div>';
  }
  content.innerHTML = content.innerHTML + '<br>';
}

var max = 9;
var start = "b11"
var stop = "b99"
var open_list = [];
var closed_list = [];
var stack = [];

function update(node) {
  if ($('#' + node).data('locked') == 1) {
    $('#' + node).css("background-color", "white")
      .data('locked', 0);
  } else {
    $('#' + node).css("background-color", "grey")
      .data('locked', 1);
  }
};

function color(node, rang) {
  $('#' + node).css("background-color", rang);
};

function lowest_open_node() //Return the node with the lowest 'f' value in the open_list
{
  console.log("\nLowest Open Node Initiated : ");
  var node = open_list[0],
    value = $('#' + open_list[0]).data('h-g-f-parent');
  for (i in open_list) {
    var attribute = $('#' + open_list[i]).data('h-g-f-parent');
    console.log("\nChecking : " + open_list[i]);
    if (attribute[2] < value[2]) {
      value = attribute;
      node = open_list[i];
    } else if (attribute[2] == value[2]) {
      if (attribute[1] < value[1]) {
        value = attribute;
        node = open_list[i];
      }
    }
  }

  var x = parseInt(node.substr(1, 1));
  var y = parseInt(node.substr(2, 1));
  node = "b" + x + y;
  console.log("\nSmallest Node : " + node);
  console.log("\n****Ended****");
  return node;
}

function reset() {
  console.log("\nEntered Reset Built Function : \n");
  var i, j;
  for (i = 1; i <= max; i++) {
    for (j = 1; j <= max; j++) {
      node = "b" + i + j;
      var attribute = $('#' + node).data('h-g-f-parent');
      attribute[0] = 0;
      attribute[1] = 0;
      attribute[2] = 0;
      attribute[3] = 'null';
      $('#' + node).data('h-g-f-parent', attribute);
      if ($('#' + node).data('locked') != 1) {
        color(node, "white");
      }
    };
  }
  open_list = [];
  closed_list = [];
  stack = [];
  console.log("\n****Ended****");
}

function add_node(list, node) {
  console.log("\nAdding Node Initiated : ");
  if (list == closed_list) {
    color(node, "yellow");
    console.log("\nTo closed_list adding node : ");
  } else if (list == open_list) {
    color(node, "blue");
    console.log("\nTo open_list adding node : ");
  }
  console.log(node);
  var i = list.indexOf(node);
  if (i == -1) {
    list.push(node);
  } else {
    console.log("\nNode : " + node + " already in the list");
  }
  console.log("\n****Ended****");
}

function remove_node(list, node) {
  console.log("\nRemoving Node Initiated : ");
  color(node, "white");
  var i = list.indexOf(node);
  console.log("\nGonna Delete : " + list[i]);
  if (i > -1) {
    list.splice(i, 1);
  }
  if (list == closed_list) {
    console.log("\n From closed_list Removing Node : " + node);
  } else if (list == closed_list) {
    console.log("\n From open_list Removing Node : " + node);
  }
  console.log("\n****Ended****");
}

function print(list, name) {
  console.log("\n" + name + " List : ");
  for (i in list) {
    console.log(list[i] + " ");
  }
  console.log("\n");
}

function check_if_exists(list, node) {
  if (list.indexOf(node) == -1) {
    return 0;
  } else {
    return 1;
  }
}

function compare_node(node1, node2, diag) //Compares if aspiring parent is actually fit to be one
{
  var increment; //Node2 is aspiring parent
  if (diag) {
    increment = 14;
  }
  increment = 10;
  var attribute1 = $('#' + node1).data('h-g-f-parent');
  var attribute2 = $('#' + node2).data('h-g-f-parent');
  /*if (attribute1[2] > attribute2[2] + increment)
  {
    return 1;
  }
  else
  {
    return 0;
  }*/
  return attribute1[1] > attribute2[1] + increment;
}

function islocked(node) {
  return $('#' + node).data('locked');
}

function update_node(node, parent, diag, e) {
  console.log("\nUpdate Node Initiated");
  var increment = 10;
  if (diag) {
    increment = 14;
  }
  console.log("\nNode : " + node + "\nParent : " + parent);
  var attribute = $('#' + node).data('h-g-f-parent');
  var attribute_parent = $('#' + parent).data('h-g-f-parent');
  console.log("\nBefore Node - \nH : " + attribute[0] + "\nG : " + attribute[1] + "\nF : " + attribute[2]);
  if (e) //Enable : First Time Visit, Calculate Heurestic
  {
    var x = parseInt(node.substr(1, 1));
    var y = parseInt(node.substr(2, 1));
    attribute[0] = 10 * (2 * max - x - y); //Math.abs(x-max) + Math.abs(y-max);
  }
  attribute[1] = attribute_parent[1] + increment;
  attribute[2] = attribute[0] + attribute[1];
  attribute[3] = parent;
  $('#' + node).data('h-g-f-parent', attribute);
  console.log("\nAfter Node - \nH : " + attribute[0] + "\nG : " + attribute[1] + "\nF : " + attribute[2]);
  console.log("\n****Ended****");
};

function update_neighbour(node) {
  console.log("\nUpdate Neighbour Intiated : \n");
  var x = parseInt(node.substr(1, 1));
  var y = parseInt(node.substr(2, 1));
  console.log("\nMain Node : " + node);
  var adjacent = [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
    [x - 1, y - 1],
    [x + 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y + 1]
  ];
  for (i in adjacent) {
    temp = adjacent[i];
    adj_node = "b" + temp[0] + temp[1];
    diag = 0;
    if (i > 3) {
      diag = 1;
    }
    if (temp[0] <= max && temp[0] > 0 && temp[1] <= max && temp[1] > 0 && !check_if_exists(closed_list, adj_node) && !islocked(adj_node)) {
      console.log("\nWorking on Node : " + adj_node);
      console.log("\nPassed Out-of-bounds, not-in-closed-list, not-locked");

      // TEMPORARY!
      var attribute = $('#' + adj_node).data('h-g-f-parent');
      var attribute_parent = $('#' + node).data('h-g-f-parent');
      console.log("\nBefore Node - \nH : " + attribute[0] + "\nG : " + attribute[1] + "\nF : " + attribute[2]);
      console.log("\nParent Node - \nH : " + attribute_parent[0] + "\nG : " + attribute_parent[1] + "\nF : " + attribute_parent[2]);
      // TEMPORARY!

      if (!check_if_exists(open_list, adj_node)) //Not Open
      {
        console.log("\nNode Not in open_list");
        update_node(adj_node, node, diag, 1); //Update as New
        add_node(open_list, adj_node);
      } else //Open
      {
        console.log("\nNode in open_list");
        if (compare_node(adj_node, node, diag)) //New Path is better
        {
          update_node(adj_node, node, diag, 0); //Update as Old
          add_node(open_list, adj_node);
        }
      }
    }
  }
  console.log("\n****Ended****");
}

function traceback(node) {
  //setTimeout(function(){color(node, "green");}, 1000);
  stack.push(node);
  console.log(node + " -> ");
  var attribute = $('#' + node).data('h-g-f-parent');
  console.log("going to parent : " + attribute[3]);
  if (attribute[3] == 'null') {
    return;
  } else {
    traceback(attribute[3]);
  }
}

function find_shortest_path() {
  reset();
  console.log("=================== A * Algorithm Started! ===================");
  add_node(open_list, start);
  while (1) {
    console.log("\n================= PASS ===================");
    if (open_list.length > 0) {
      print(open_list, "Open");
      print(closed_list, "Closed");
      var current = lowest_open_node();
      remove_node(open_list, current);
      add_node(closed_list, current);
      if (current == stop) {
        traceback(current);
        while (stack.length > 0) //Printing Stack
        {
          temp_node = stack.pop();
          console.log("\nColored : " + temp_node)
          color(temp_node, "green");
        }
        break;
      }
      update_neighbour(current);
    } else {
      alert("Shortest Distance Not Found!");
      break;
    }
  }
  console.log("=================== A * Algorithm Ended! ===================");
};