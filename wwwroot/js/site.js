$(function() {
    const apiKey = '19afc1f70ed614ec13fa6c340fd234fdaef6b23d';
    
    const backgroundImgs =[
        'css/image1.jpg' ,
        'css/image2.jpg' ,
        'css/image3.jpg' ,
        'css/image4.jpg' ,
    ]
    
    let currImage = 0;
    
    $("#Title").on("click", function() {
        currImage = (currImage + 1) % backgroundImgs.length;
        $("body").css("background-image", `url('${backgroundImgs[currImage]}')`);    })

    $("#timeButton").on("click", function() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');   // HH
        const minutes = String(now.getMinutes()).padStart(2, '0'); // MM
        const formatted = `${hours}:${minutes}`;
        
        $("#time").css("visibility", "visible");
        $("#time").text(formatted); 

        $("#time").dialog({         
            title: "Current Time",
            modal: true,
            width: 300,
            buttons: {
                Close: function() {
                    $(this).dialog("close");
                }
            }
        });
    });
    
    $("#searchButton").on("click", function () {
        const queryString = $("#query").val();
        
        if (!queryString) {
            console.log("No search entered.");
            return;
        }
        
        
        const encodedQuery = encodeURIComponent(queryString);
        
        const settings = {
            "url": `https://google.serper.dev/search?q=${encodedQuery}&apiKey=${apiKey}`, 
            "method": "GET",
            "timeout": 0,
        };
        
        $.ajax(settings).done(function (response) {
            console.log(response);
            $("#searchResults").html('');
            $("#searchResults").css("visibility", "visible");
            
            // Knowledge Graph
            if (response.knowledgeGraph) {
                const kg = response.knowledgeGraph;
                $("#searchResults").append(`
                    <div class="knowledge-graph">
                            <h3>${kg.title}</h3>
                            <p>${kg.type}</p>
                            <img src="${kg.imageUrl}" alt="${kg.title}">
                            <p>${kg.description}</p>
                            <a href="${kg.descriptionLink}" target="_blank">More results from Wikipedia</a>
                    </div>
                `);

            }
            
            //Organic Results
            if (response.organic) {
                let html = '<div id="organic">';
                response.organic.forEach(function (result) {
                    html += `
                        <div class="organic-result">
                            <a href="${result.link}" target="_blank"><h3>${result.title}</h3></a>
                            <p>${result.link}</p>
                            <p>---${result.snippet}</p>
                        </div>
                    `;
                });
                html += '</div>';
                $("#searchResults").append(html);
            }
            
            //People also ask
            if (response.peopleAlsoAsk) {
                let html = '<div id="people-also-ask"><h3>People Also Ask</h3>';
                response.peopleAlsoAsk.forEach(function(item) {
                    html += `
                        <details>
                            <summary>${item.question}</summary>
                            <p>${item.snippet}</p>
                            <a href="${item.link}" target="_blank">Read more</a>
                        </details>
                    `;
                });
                html += '</div>';
                $("#searchResults").append(html);
            }
            
            
            //Related Searches
            if (response.relatedSearches) {
                let html = '<div id="related-searches"><h3>Related Searches</h3>';
                response.relatedSearches.forEach(function(item) {
                    html += `<button class="related-button">${item.query}</button>`;
                });
                html += '</div>';
                $("#searchResults").append(html);
            }
            $(document).on("click", ".related-button", function() {
                $("#query").val($(this).text());
                $("#searchButton").trigger("click");
            });
            
        })
  
    });

});
