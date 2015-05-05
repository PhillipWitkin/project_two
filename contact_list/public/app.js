console.log("app.js linked")

var $selectCategoryMain = $('select[data-action="main-category"]')

var $createCategory = $('.ui.button[data-action="create-category"]')

var $contactListHolder = $('.ui.segment[data-attr="contact-holder"]')

var $newCategoryTemplate = $('script[data-id="new-category-input"]')

// $selectCategoryMain.on('change', function(event){
//   console.log(event.target)
// })

var $categoryListTemplate = $('script[data-id="category-items"]').text()

var $categoryLabelTemplate = $('script[data-attr="category-label-template"]').text()

var $contactListTemplate = $('script[data-attr="contact-list-template"]').text()

var $contactListItem = $('script[data-attr="contact-list-item"]').text()

var $contactImageTemplate = $('script[data-attr="contact-image"]').text()

var $contactDetailTemplate = $('script[data-attr="contact-detail-table"]').text()




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
    //add category label for contacts to the dom
    var categoryObject = {category_name: text, category_id: value}
    var html = Mustache.render($categoryLabelTemplate, categoryObject)
    $('div[data-attr="contact-holder"]').empty()
    $('div[data-attr="contact-holder"]').append(html)
    //add empty contact list to the dom 
    $('div[data-attr="contact-holder"]').append($contactListTemplate)
    //make ajax call to fill contact list
    $.ajax({
      method: "GET",
      url: "/categories/" + value + "/contacts"
    }).done(function(contacts){
      var listItems=[]
      contacts.forEach(function(contact){
        var html = Mustache.render($contactListItem, contact)
        listItems.push(html)        
      })
      $('div[data-id="contact-list"]').append(listItems)
    })

  }});

//listen to list for detail of a contact
$contactListHolder.on('click', '[data-attr="individual-contact"]', function(event){
  // console.log(event.target)
  var contactId = $(event.target).attr('data-id')
  console.log(contactId)
  //make ajax call for contact details
  $.ajax({
    method: "GET",
    url: "/contacts/" + contactId
  }).done(function(contact){
    var html = Mustache.render($contactDetailTemplate, contact)
    $('div[data-attr="contact-details"]').empty()
    $('div[data-attr="contact-details"]').append(html)//insert table of contact details
    
    var htmlImage = Mustache.render($contactImageTemplate, contact)
    $('div[data-attr="image-holder"]').empty()
    $('div[data-attr="image-holder"]').append(htmlImage)//insert contact image
  })
})

//create contact
$('div[data-attr="contact-holder"]').on('click', '[data-action="create-contact"]',function(event){
    var categoryId = $('div[data-id="category-label"]').attr('data-value')
    var contactInfo = {
    categorieId: categoryId,
    name: "",
    city: "",
    email: "",
    phone: "",
    image_url: ""
  }

  $.ajax({
    method: "POST",
    url: "/contacts/", 
    data: JSON.stringify(contactInfo),
    contentType: "application/json"
  }).done(function(contact){
    var html = Mustache.render($contactDetailTemplate, contact)
    $('div[data-attr="contact-details"]').empty()
    $('div[data-attr="contact-details"]').append(html)//insert table of empty contact details
    // var $contactImageTemplate = $('script[data-attr="contact-image"]').text()
    var htmlImage = Mustache.render($contactImageTemplate, contact)
    $('div[data-attr="image-holder"]').empty()
    // $('div[data-attr="image-holder"]').append(htmlImage)//insert contact image
  })
}) 


//save contact
$('div[data-attr="contact-details"]').on('click', '[data-action="save-contact"]', function(event){
  var table = $(event.target).parents('table')
  var contactId = table.attr('data-id')
  console.log(contactId)
  var contactName = table.find('[data-attr="contact_name"]').text()
  var contactCity = table.find('[data-attr="city"]').text()
  var contactEmail = table.find('[data-attr="email"]').text()
  var contactPhone = table.find('[data-attr="phone"]').text()
  var contactImageUrl = table.find('[data-attr="image_url"]').text()
  
  //obect to be sent to ajax call
  var contactInfo = {
    name: contactName,
    city: contactCity,
    email: contactEmail,
    phone: contactPhone,
    image_url: contactImageUrl
  }

  $.ajax({
    method: "PUT",
    url: "/contacts/" + contactId,
    data: JSON.stringify(contactInfo),
    contentType: "application/json"
  }).done(function(contact){
    var html = Mustache.render($contactDetailTemplate, contact)
    $('div[data-attr="contact-details"]').empty()
    $('div[data-attr="contact-details"]').append(html)//insert table of contact details
    var $contactImageTemplate = $('script[data-attr="contact-image"]').text()
    var htmlImage = Mustache.render($contactImageTemplate, contact)
    $('div[data-attr="image-holder"]').empty()
    $('div[data-attr="image-holder"]').append(htmlImage)//insert contact image
  })

  var categoryId = $('div[data-id="category-label"]').attr('data-value')
  $.ajax({
    method: "GET",
    url: "/categories/" + categoryId + "/contacts"
  }).done(function(contacts){
    var listItems=[]
    contacts.forEach(function(contact){
    var html = Mustache.render($contactListItem, contact)
    listItems.push(html)        
  
    $('div[data-id="contact-list"]').empty()
    $('div[data-id="contact-list"]').append(listItems)
    })
  })
}) 

//delete contact
$('div[data-attr="contact-details"]').on('click', '[data-action="delete-contact"]', function(event){
  var table = $(event.target).parents('table')
  var contactId = table.attr('data-id')
  $.ajax({
    method: "DELETE",
    url: "/contacts/" + contactId
  }).done(function(contact){
    //remove details from the dom
    $('div[data-attr="contact-details"]').empty()
    $('div[data-attr="image-holder"]').empty()
    //reload contact list
    var categoryId = $('div[data-id="category-label"]').attr('data-value')
    $.ajax({
      method: "GET",
      url: "/categories/" + categoryId + "/contacts"
    }).done(function(contacts){
      var listItems=[]
      contacts.forEach(function(contact){
        var html = Mustache.render($contactListItem, contact)
        listItems.push(html)        
      })
      $('div[data-id="contact-list"]').empty()
      $('div[data-id="contact-list"]').append(listItems)
    })

  })
})

//cancel contact
$('div[data-attr="contact-details"]').on('click', '[data-action="cancel-contact"]', function(event){
  $('div[data-attr="contact-details"]').empty()
  $('div[data-attr="image-holder"]').empty()
})

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







