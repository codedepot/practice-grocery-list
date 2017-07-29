var items = [];//tracks the grocery items added0
var groceryCount = 0;//A total count that is used for unique id generation

$(document).ready(function(){
  GroceryListWidget.init();
});


var GroceryListWidget = {
  init: function(){//produce the list from local history

    //fill the list with the items
    GroceryListWidget.refreshItemsList();
    GroceryListWidget.eventsInit();
  },
  refreshItemsList:function(){//remove old items and reload from local storage
    //remove aold list
    $(".grocery-item").remove();
    //if saved from last session
    if(localStorage.items!== "" && localStorage.items !== undefined){
      items = JSON.parse(localStorage.items);
      if(localStorage.groceryCount !== undefined && localStorage.groceryCount !== ""){
        groceryCount = Number(localStorage.groceryCount);
      }
      //use template and create copies for each item
      var template = $("#item-template");
      for (var i = 0; i < items.length; i++) {
        var curItem = template.clone();
        curItem.find(".item-title").html(items[i].title);
        curItem.find(".item-content").html(items[i].content);
        curItem.find(".item-id").val(items[i].itemId);
        curItem.removeClass("hidden").removeAttr("id").addClass("grocery-item");
        template.after(curItem);
        curItem.find(".expand-item").attr("href", curItem.find(".expand-item").attr("href" ) + i );
        curItem.find(".content-accordion").attr("id", curItem.find(".content-accordion").attr("id" ) + i );
        if(items[i].isChecked === true){
          curItem.find(".check-item .fa").addClass("fa-check-square-o").removeClass("fa-square-o");
          curItem.addClass("checked");
        }

      }
      GroceryListWidget.itemBtnEvents();
      $('[data-toggle="tooltip"]').tooltip();
    }else{
      //if there is no messages
      $("#no-items-message").removeClass("hidden");
    }

  },
  eventsInit:function(){//bind global item events
    $("#add-item-confirm-btn").on("click", function(){//submit add item modal
      var title = $("#addItemModal .item-title-input").val();
      var content = $("#addItemModal .item-content-input").val();
      if(title !== ""){
        GroceryListWidget.addItem(title, content);
      }
      $("#addItemModal").modal("hide");
      $("#addItemModal input, #addItemModal textarea").val("");
      GroceryListWidget.refreshItemsList();
    });
    $("#edit-item-confirm-btn").on("click", function(){
      var title  = $("#editItemModal .item-title-input").val();
      var content  = $("#editItemModal .item-content-input").val();
      var itemId  = Number($("#editItemModal .item-id").val());

      var index = -1;
      for (var i = 0; i < items.length; i++) {
        if(items[i].itemId === itemId){
          index = i;
        }
      }
      if(index !== -1){
        items[index] = {title:title, content:content, itemId: itemId};
      }
      localStorage.items = JSON.stringify(items);
      $("#editItemModal").modal("hide");
      GroceryListWidget.refreshItemsList();

    });
    $("#delete-item-confirm-btn").on("click",function(){
      var itemDiv = $(".delete-confirm");
      var itemId = Number(itemDiv.find(".item-id").val());
      var index = -1;
      for (var i = 0; i < items.length; i++) {
        if(itemId === items[i].itemId){
          index = i;
        }
      }
      if(index !== -1){//if the item in question was found then remove it
        if(items.length === 1){
          items = [];
        }else{
          items.splice(index, 1);
        }
        localStorage.items = JSON.stringify(items);
        GroceryListWidget.refreshItemsList();
      }
      $("#deleteItemModal").modal("hide");
    });

  },
  itemBtnEvents: function(){//bind item events, these items get removed and recreated so this function is called on refresh
    $(".grocery-item .edit-item").on("click", function(){
      var itemDiv = $(this).closest(".grocery-item");
      $("#editItemModal .item-title-input").val(itemDiv.find(".item-title").html());
      $("#editItemModal .item-content-input").val(itemDiv.find(".item-content").html());
      $("#editItemModal .item-id").val(itemDiv.find(".item-id").val());
      $("#editItemModal").modal("show");
    });
    $(".grocery-item .delete-item").on("click", function(){//the btn launche the modal
      $(".delete-confirm").removeClass("delete-confirm");
      $(this).closest(".grocery-item").addClass("delete-confirm");
      $("#deleteItemModal").modal("show");
    });
    $(".grocery-item .check-item").on("click", function(){//indeicating the item is purchased
      var icon = $(this).find(".fa");
      var itemId = Number($(this).closest(".grocery-item").find(".item-id").val());
      if(icon.hasClass("fa-square-o")){
        icon.addClass("fa-check-square-o").removeClass("fa-square-o");
        GroceryListWidget.editItemCheck(itemId, true);
        $(this).closest(".grocery-item").addClass("checked");
      }else{
        icon.removeClass("fa-check-square-o").addClass("fa-square-o");
        GroceryListWidget.editItemCheck(itemId, false);
        $(this).closest(".grocery-item").removeClass("checked");
      }
      $(this).tooltip("hide");
    });
    $("#add-item-btn").on("click", function(){//remove old values
      $("#addItemModal input, #addItemModal textarea").val("");
    });
  },
  addItem: function(title, content){//add item to local storage
    var itemId = groceryCount;
    groceryCount++;
    localStorage.groceryCount = groceryCount;
    items.push({title:title, content:content, itemId:itemId});
    localStorage.items = JSON.stringify(items);
  },
  editItem: function(item){//when the new, updated object is at hand
    var index = -1;
    for (var i = 0; i < items.length; i++) {
      if(items[i].itemId === item.itemId){
        index = i;
      }
    }
    if(index !== -1){
      items[index] = item;
    }
    localStorage.items = JSON.stringify(items);
  },
  editItemCheck: function(itemId, isChecked){//when the check is clicked
    var index = -1;
    var item;
    for (var i = 0; i < items.length; i++) {
      if(items[i].itemId === itemId){
        index = i;
        item = items[i];
      }
    }
    item.isChecked = isChecked;
    if(index !== -1){
      items[index] = item;
    }
    localStorage.items = JSON.stringify(items);
  }

};
