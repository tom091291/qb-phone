var DocEndtitle = null
var DocEndtext = null
var DocEndid = null
var DocEndcitizenid = null

$(document).ready(function(){
    $("#documents-search").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".documents-test").filter(function() {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
    });
});

$(document).on('click', '.documents-tupe-text-btn', function(e){
    e.preventDefault();
    ClearInputNew()
    $('#documents-box-new-add-new').fadeIn(350);
});

$(document).on('click', '.documents-body-btn-three', function(e){
    e.preventDefault();
    ClearInputNew()
    $('#documents-send-stateid').fadeIn(350);
});

$(document).on('click', '#documents-save-stateid', function(e){
    e.preventDefault();
    var date = new Date();
    var Times = date.getDay()+" "+MonthFormatting[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    var StateID = $(".documents-input-stateid").val();
    var NewText = $("#documents-textarea-new").val();
    if(NewText != ""){
        $.post('https://qb-phone/documents_Save_Note_As', JSON.stringify({
            Title: DocEndtitle,
            Text: NewText,
            Time: Times,
            ID: DocEndid,
            CSN: DocEndcitizenid,
            StateID: StateID,
            Type: "Send",
        }));
    }
    ClearInputNew()
    $('#documents-send-stateid').fadeOut(350);
});

$(document).on('click', '#documents-save-note-for-doc', function(e){
    e.preventDefault();
    var Title = $(".documents-input-title").val();
    var Text = $("#documents-textarea").val();
    var date = new Date();
    var Times = date.getDay()+" "+MonthFormatting[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();

    if ((Title &&Text ) != ""){
        $.post('https://qb-phone/documents_Save_Note_As', JSON.stringify({
            Title: Title,
            Text: Text,
            Time: Times,
            Type: "New",
        }));
        ClearInputNew()
        $("#documents-textarea").val("");
        $('#documents-box-new-add-new').fadeOut(350);
    }
});

function LoadGetNotes(){
    $(".documents-dropdown-menu").html("");

    var Shitter = '<li id="documents-docs" data-title="Documents">Documents' +
        '<li id="documents-licenses" data-title="Licenses">Licenses</li>' +
        '<li id="documents-vehicle" data-title="Vehicle">Vehicle Registrations</li>' +
    
    '</li>';

    $('.documents-dropdown-menu').append(Shitter);

    //var AddOption = '<div class="casino-text-clear">Nothing Here!</div>'+
    //                '<div class="casino-text-clear" style="font-size: 500%;color: #0d1218c0;"><i class="fas fa-frown"></i></div>'
    //$('.documents-list').append(AddOption);
}

$(document).on('click', '#documents-docs', function(e) {
    $(this).parents('.documents-dropdown').find('span').text($(this).text());
    $(this).parents('.documents-dropdown').find('input').attr('value', $(this).attr('id'));
    $.post('https://qb-phone/GetNote_for_Documents_app', JSON.stringify({}), function(HasNote){
        if(HasNote){
            AddDocuments(HasNote)
        }
    });
});

$(document).on('click', '#documents-licenses', function(e) {
    $(this).parents('.documents-dropdown').find('span').text($(this).text());
    $(this).parents('.documents-dropdown').find('input').attr('value', $(this).attr('id'));
    console.log("LICENSES")
});

$(document).on('click', '#documents-vehicle', function(e) {
    $(this).parents('.documents-dropdown').find('span').text($(this).text());
    $(this).parents('.documents-dropdown').find('input').attr('value', $(this).attr('id'));
    console.log("VEHICLE")
});

$(document).ready(function(){
    window.addEventListener('message', function(event) {
        switch(event.data.action) {
            case "DocumentRefresh":
                LoadGetNotes()
            break;
        }
    })
});

function AddDocuments(data){
    $(".documents-list").html("");

    DocEndtitle = null
    DocEndtext = null
    DocEndid = null
    DocEndcitizenid = null

    for (const [k, v] of Object.entries(data)) {
        var firstLetter = v.title.substring(0, 1);  
        var Fulltext = firstLetter.toUpperCase()+(v.title).replace(firstLetter,'')

        var AddOption = '<div class="documents-test">' + 
            '<div class="documents-title-title">'+Fulltext+'</div>' +
            '<div class="documents-title-icon" data-title="'+v.title+'" data-text="'+v.text+'" data-id="'+v.id+'" data-csn="'+v.citizenid+'"><i class="fas fa-eye"></i></div>'+
        '</div>';

        $('.documents-list').append(AddOption);
    }
}

$(document).on('click', '.documents-title-icon', function(e){
    e.preventDefault();
    $(".documents-list").html("");

    $('.documents-tupe-text-btn').fadeOut(50);
    $('#documents-search-text').fadeOut(50);
    $('#documents-search-icon').fadeOut(50);
    $('#documents-search').fadeOut(50);
    $('.documents-dropdown').fadeOut(50);
    $('.documents-select').fadeOut(50);


    DocEndtitle = $(this).data('title')
    DocEndtext = $(this).data('text')
    DocEndid = $(this).data('id')
    DocEndcitizenid = $(this).data('csn')

    var AddOption = '<div class="document-body-class-body-main">'+
                        '<textarea id="documents-textarea-new" spellcheck="false" required placeholder="Text" maxlength="4000">'+DocEndtext+'</textarea>'+
                        '<div class="documents-body-btn-class">'+
                            '<div class="documents-body-btn-one"><i class="fas fa-edit"></i></div>'+
                            '<div class="documents-body-btn-two"><i class="fas fa-trash"></i></div>'+
                            '<div class="documents-body-btn-three"><i class="fas fa-ellipsis-v"></i></div>'+
                        '</div>'+
                    '</div>';

    var AnotherOption = '<div class="document-body-class-body-main">'+
                            '<div class="documents-body-btn-four"><i class="fas fa-ellipsis-v"></i></div>'+
                            '<div class="documents-input-title">Title</div>'+
                            '<div class="documents-input-title-name">'+DocEndtitle+'</div>'+
                            '<div class="documents-input-tags"><i class="fas fa-tags"></i></div>'+
                            '<div class="documents-input-back"><i class="fas fa-chevron-left"></i></div>'+
                        '</div>';

    $('.documents-list').append(AddOption);
    $('.documents-header').append(AnotherOption);
});

$('.documents-dropdown').click(function () {
    $(this).attr('tabindex', 1).focus();
    $(this).toggleClass('active');
    $(this).find('.documents-dropdown-menu').slideToggle(300);
});

$('.documents-dropdown').focusout(function () {
    $(this).removeClass('active');
    $(this).find('.documents-dropdown-menu').slideUp(300);
});

$(document).on('click', '.documents-body-btn-one', function(e){
    e.preventDefault();
    var date = new Date();
    var Times = date.getDay()+" "+MonthFormatting[date.getMonth()]+" "+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
    var NewText = $("#documents-textarea-new").val();
    if(NewText != ""){
        $.post('https://qb-phone/documents_Save_Note_As', JSON.stringify({
            Title: DocEndtitle,
            Text: NewText,
            Time: Times,
            ID: DocEndid,
            CSN: DocEndcitizenid,
            Type: "Update",
        }));
    }
});

$(document).on('click', '.documents-input-back', function(e) {
    MainMenu()
    LoadGetNotes()
});

$(document).on('click', '.documents-body-btn-two', function(e){
    e.preventDefault();

    $.post('https://qb-phone/documents_Save_Note_As', JSON.stringify({
        ID: DocEndid,
        Type: "Delete",
    }));
    MainMenu()
    LoadGetNotes()
});

function MainMenu(){
    $(".documents-list").html("");
    $(".document-body-class-body-main").html("");
    $('.documents-tupe-text-btn').fadeIn(50);
    $('#documents-search-text').fadeIn(50);
    $('#documents-search-icon').fadeIn(50);
    $('#documents-search').fadeIn(50);
    $('.documents-dropdown').fadeIn(50);
    $('.documents-select').fadeIn(50);
}