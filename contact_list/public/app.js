console.log("app.js linked")

var $selectCategoryMain = $('select[data-action="main-category"]')

var $createCategory = $('.ui.button[data-action="create-category"]')

var $newCategoryTemplate = $('script[data-id="new-category-input"]')

// $selectCategoryMain.on('change', function(event){
//   console.log(event.target)
// })
var $categoryListTemplate = $('script[data-id="category-items"]').text()



$createCategory.on('click', function(event){
  //add new input field to the dom
  console.log(event.target)
  console.log($('div[data-id="new-category"]'))
  console.log($newCategoryTemplate)
  $('div[data-id="new-category"]').append(($newCategoryTemplate).text())

})

//listen for save category
$('div[data-id="new-category"]').on('click', '[data-action="save-new-category"]', function(event){
    console.log("save new category")
    var newCategory = $('input[data-id="new-category-name').val()
    console.log(newCategory)
    $.ajax({
      method: "POST",
      url: "/categories",
      data: JSON.stringify({name: newCategory}),
      contentType: "application/json"
    }).done(function(data){
      console.log(data)
      //remove input field from the dom
      $('span[data-id="category-new"]').empty()
    })
})

//listen for cancel new category
$('div[data-id="new-category"]').on('click', '[data-action="cancel-new-category"]', function(event){
  console.log("cancel new category")
  $('span[data-id="category-new"]').empty()
})

//create list for selected category

$('.ui.dropdown')
  .dropdown({onChange: function(value, text) { 
    console.log(value, text)
    // $.ajax({
    //   method: "GET",
    //   url: "/categories/" + value
    // })

  }});

//load list of categories
$.ajax({
  method: "GET",
  url: "/categories"
}).done(function(categories){
  var categoryItems = []
  categories.forEach(function(category){
    var html= Mustache.render($categoryListTemplate, category)
    categoryItems.push(html)
  })
  $('div[data-attr="category-list"]').append(categoryItems)

})







