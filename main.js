var books = [
    {
        title: 'Harry Potter',
        author: 'J.K. Rowling',
        imageURL: 'https://books.google.com/books/content?id=WV8pZj_oNBwC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api',
        isbn: '9781921479311',
        pageCount: 268
    }
];

var renderBooks = function() {
    $(".books").empty();

    var source = $("#book-template").html();
    var template = Handlebars.compile(source);

    for (i=0; i<books.length; i++) {
        var newHTML = template({
            title: books[i].title,
            author: books[i].author,
            pageCount: books[i].pageCount,
            isbn: books[i].isbn,
            imageURL: books[i].imageURL
        });
        $(".books").append(newHTML);    
    }
};

$('.search').on('click', function () {
    var search = $('#search-query').val();
  
    fetch(search);
});

var fetch = function (query, index=0) {
    $.ajax({
        method: "GET",
        url: "https://www.googleapis.com/books/v1/volumes?q=" + query + `&startIndex=${index}`,
        dataType: "json",
        success: function (data) {
          addBooks(data, index);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(textStatus);
        },
    });
};

var addBooks = function(data, index) {
    books = [];
    
    for (i=0; i<data.items.length; i++) {
        var book = {
            title: data.items[i].volumeInfo.title,
            author: data.items[i].volumeInfo.authors[0],
            imageURL: data.items[i].volumeInfo.imageLinks.thumbnail,
            isbn: data.items[i].volumeInfo.industryIdentifiers[1].identifier,
            pageCount: data.items[i].volumeInfo.pageCount
        };

        books.push(book);
    }
    renderBooks();

    if (data.totalItems > index+10) {
        $nextBtn = $("<button>");
        $nextBtn.text("See more results");
        $nextBtn.click(function() {
            var search = $('#search-query').val();
            fetch(search, index+10);
        });

        $(".books").append($nextBtn);
    }
};

renderBooks();
