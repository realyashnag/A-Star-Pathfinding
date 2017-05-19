var max = 4;
var start = "b11"
var stop = "b44"
var open_list = [];         //Open List (node id)
var closed_list = [];       //Closed list (node id)

function update(node)
{
  if ($('#'+node).data('locked')==1)
  {
    $('#'+node).css("background-color","white")
               .data('locked',0);
  }
  else
  {
    $('#'+node).css("background-color","grey")
               .data('locked',1);
  }
};

function color(node, rang)
{
  $('#'+node).css("background-color",rang);
};

function lowest_open_node()                                   //Return the node with the lowest 'f' value in the open_list
{
  var node = open_list[0], value = $('#'+ open_list[0]).data('h-g-f-parent');
  for (i in open_list)
  {
    var attribute = $('#'+ open_list[i]).data('h-g-f-parent');
    console.log("\nChecking with Node : " + open_list[i]);
    if (attribute[2] < value[2])
    {
      value = attribute;
      node = open_list[i];
    }
  }
  console.log("\nFinally Chosen Node : " + node);
  var x = parseInt(node.substr(1,1));
  var y = parseInt(node.substr(2,1));
  node = "b" + x + y;
  console.log("\nLowest 'f' Value Open Node : " + node);
  return node;
}

function reset()
{
  console.log("\nEntered Reset Built Function : \n");
  var i, j;
  for (i=1; i<=max; i++)
  {
    for (j=1; j<=max; j++)
    {
      node = "b"+i+j;
      var attribute = $('#'+node).data('h-g-f-parent');
      attribute[0] = 0;
      attribute[1] = 0;
      attribute[2] = 0;
      attribute[3] = 'null';
      $('#'+node).data('h-g-f-parent',attribute);
      if ($('#'+node).data('locked') != 1)
      {
        color(node, "white");
      }
    };
  }
  open_list = [];
  closed_list = [];
}


function add_node(list, node)
{
  list.push(node);
}

function remove_node(list, node)
{
  var i = list.indexOf(node);
  console.log("\nGonna Delete : " + list[i]);
  if (i > -1)
  {
    list.splice(i, 1);
  }
}

function print(list, name)
{
  console.log("\n" + name + " List : ");
  for (i in list)
  {
    console.log(list[i] + " ");
  }
  console.log("\n");
}

function check_if_exists(list, node)        //Checks if a node is present in passed list : Returns 1 if not present, 0 if present
{
  if (list.indexOf(node) == -1)
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

function compare_node(node1, node2)     //Node-2 is hopeful parent
{
  var attribute1 = $('#'+ node1).data('h-g-f-parent');
  var attribute2 = $('#'+ node2).data('h-g-f-parent');
  if (attribute1[2] > attribute2[2] + 10)
  {
    return 1;
  }
  else
  {
    return 0;
  }
}

function update_node(node, parent, e)
{
  var attribute = $('#'+ node).data('h-g-f-parent');
  var attribute_parent = $('#'+ parent).data('h-g-f-parent');
  if (e)                                                            //Enable : First Time Visit, Calculate Heurestic
  {
    var x = parseInt(node.substr(1,1));
    var y = parseInt(node.substr(2,1));
    attribute[0] =  Math.abs(x-max) + Math.abs(y-max);
  }
  attribute[1] = attribute_parent[1] + 10;
  attribute[2] = attribute[0] + attribute[1];
  attribute[3] = parent;
  $('#'+node).data('h-g-f-parent',attribute);
};

function islocked(node)
{
  if ($('#'+ node).data('locked'))
  {
    return 0;
  }
  else
  {
    return 1;
  }
}

function update_neighbour(node)
{
  var x = parseInt(node.substr(1,1));
  var y = parseInt(node.substr(2,1));
  //console.log("x = " + x + "  -- y = " + y);
  var adjacent =[[x+1, y], [x-1,y], [x,y+1], [x,y-1]];
  for (x in adjacent)
  {
    temp = adjacent[x];
    console.log("\nX coordinate : " + temp[0] + "  -  Y coordinate : " + temp[1]);
    if (temp[0] <= max && temp[0] > 0 && temp[1] <= max && temp[1] > 0 && check_if_exists(closed_list, "b"+temp[0]+temp[1]) && islocked("b"+temp[0]+temp[1]))
    {
      console.log("\nPassed Out-of-bounds, not-in-closed-list, not-locked");
      if (check_if_exists(open_list, "b"+temp[0]+temp[1]))   //Not Open
      {
        update_node("b"+temp[0]+temp[1], node, 1); //Update as New
        add_node(open_list, "b"+temp[0]+temp[1]);
      }
      else                                                    //Open
      {
        if (compare_node("b"+temp[0]+temp[1], node))  //New Path is better
        {
          update_node("b"+temp[0]+temp[1], node, 0); //Update as Old
          add_node(open_list, "b"+temp[0]+temp[1]);
        }
      }
    }
  }
}

function traceback(node)
{
  //setTimeout(function(){color(node, "green");}, 1000);
  color(node, "green");
  console.log(node + " -> ");
  var attribute = $('#'+ node).data('h-g-f-parent');
  console.log("going to parent : " + attribute[3]);
  if (attribute[3]==null)
  {
    return;
  }
  else
  {
    traceback(attribute[3]);
  }
}

function find_shortest_path()
{
  console.log("=================== A * Algorithm Started! ===================");
  add_node(open_list, start);
  while (1)
  {
    var current = lowest_open_node();
    remove_node(open_list, current);
    add_node(closed_list, current);
    if (current == stop)
    {
      //alert("Minimum Path Highlighted!");
      console.log("\nTraceback Initiated : ");
      traceback(current);
      console.log("\n-----------------------\nTraceback Ended : ");
      break;
    }
    console.log("\nGoing into Update_Neighbour Function : \n");
    update_neighbour(current);
    print(open_list, "Open");
    print(closed_list, "Closed");
  }
};
