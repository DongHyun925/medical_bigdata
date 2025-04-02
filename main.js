const API_KEY = `ZM7V7EK7WP42MPG4C077`
let url = new URL(`http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&director=박찬욱&ServiceKey=${API_KEY}`);
let movieList = [];
const categoryButton = document.querySelectorAll("#category-button button");
categoryButton.forEach(genre=>genre.addEventListener("click", (event)=>getMovieByGenre(event)));
const searchButton = document.getElementById("search-button");
const inputBox = document.getElementById("input-box");
let TotalCount = 0;
let startCount=1;
let listCount=10;
const groupSize = 5;
const mainButton = document.getElementById("main-button");

mainButton.addEventListener("click", (e)=>goToMain(e))


inputBox.addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        event.preventDefault();
        searchButton.click();
    }
});

inputBox.addEventListener("focus", function(){
    this.value="";
})


const getMovie = async()=>{
    try{url.searchParams.set("startCount", startCount);
        url.searchParams.set("listCount", listCount);
        const response = await fetch(url);
        const data = await response.json();
        console.log("data",data)
        if(response.status===200){
            if(data.Data[0].TotalCount===0){
                throw new Error("검색어에 맞는 결과가 없습니다.")
            }
            movieList = data.Data[0].Result;
            TotalCount = data.Data[0].TotalCount;
            render();
            paginationRender();    
        }

    }catch(error){
        errorRender(error.message)

    }

}
    

const getMainMovie = async()=>{
    url = new URL(`http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&director=박찬욱&ServiceKey=${API_KEY}`);
    getMovie();
}

const getMovieByGenre = async(event)=>{
    const genre = event.target.textContent
    url = new URL(`http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&genre=${genre}&ServiceKey=${API_KEY}`)
    getMovie();
}

const getMovieByTitle = async()=>{
    const title = document.getElementById("input-box").value;
    url = new URL(`http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&title=${title}&ServiceKey=${API_KEY}`);
    getMovie();
}

const getMovieByDirector = async()=>{
    const director = document.getElementById("input-box").value;
    url = new URL(`http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&director=${director}&ServiceKey=${API_KEY}`);
    getMovie();
    
} 

const getMovieByActor = async()=>{
    const actor = document.getElementById("input-box").value;
    url = new URL(`http://api.koreafilm.or.kr/openapi-data2/wisenut/search_api/search_json2.jsp?collection=kmdb_new2&actor=${actor}&ServiceKey=${API_KEY}`);
    getMovie();
}



const render = ()=>{
    const movieHTML =movieList.map(movie=>`<div class="row">
                <div class="col-lg-3"><img class="movie-poster" 
                src="${movie.posters == ""
                    ? "https://timescineplex.com/times/img/no-poster.png"
                    : movie.posters.includes("|")
                    ? movie.posters.substr(0,movie.posters.indexOf("|",0))
                    : movie.posters
                    }"/></div>
                <div class="col-lg-9 description">
                    <a class="title" target="_blank" href=${movie.kmdbUrl}>${movie.title}</a>
                    <p>영제| ${movie.titleEng}</p>
                    <p>원제| ${movie.titleOrg ==""
                        ? "정보없음"
                        : movie.titleOrg}</p>
                    <div class="movie-info">
                        <div>장르| ${movie.genre}</div>
                        <div>관람기준| ${movie.ratings.rating.map(rate=>
                            `${rate.ratingGrade ==""
                            ? "정보없음"
                            : rate.ratingGrade.includes("|")
                            ? rate.ratingGrade.substr(0,rate.ratingGrade.indexOf("|",0))
                            : rate.ratingGrade}`)}</div>
                        <div>국가| ${movie.nation}</div>
                        <div>러닝타임| ${movie.runtime}분</div>
                        <div>제작년도| ${movie.prodYear}</div>
                    </div>
                        <div>키워드| ${movie.keywords ==""
                            ? "정보없음"
                            : movie.keywords}</div>
                    
                    <div>감독| ${movie.directors.director.map(name=>`${name.directorNm}`)}</div>
                    <div>배우| ${movie.actors.actor.splice(0,6).map(name=>
                        `${name.actorNm ==""
                        ? "정보없음"
                        : name.actorNm}`)}</div>
                    <div>줄거리| ${movie.plots.plot.map(text=>
                        `${text.plotText==null
                        ? "내용없음"
                        : text.plotText.length>=200
                        ? text.plotText.substr(0,100)+"..."
                        : text.plotText}`)}</div>
                    
                </div>
            </div>`).join('');



    document.getElementById("movie-detail").innerHTML=movieHTML;
}


const errorRender =(errorMessage)=>{

    const errorHTML = `<div class="alert alert-danger" role="alert">
    ${errorMessage}
    </div>`

    document.getElementById("movie-detail").innerHTML=errorHTML;
}


const paginationRender = ()=>{
    let totalPage = Math.ceil(TotalCount/listCount);
    let pageGroup = Math.ceil(startCount/groupSize);
    let lastPage = pageGroup*groupSize;
    let firstPage = lastPage-(groupSize-1)<=0?1:lastPage-(groupSize-1);
    let paginationHTML = ``;

    if(startCount>1){
        paginationHTML +=`<li class="page-item" onclick="moveToPage(${1})"><a class="page-link" >&lt&lt</a></li>
        <li class="page-item" onclick="moveToPage(${startCount-1})"><a class="page-link" >&lt</a></li>`
    }

    for(let i = firstPage; i<=lastPage; i++){
        paginationHTML+=`<li class="page-item ${i===startCount? "active" :""}" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`
    }

    if(startCount<totalPage){
        paginationHTML +=`<li class="page-item" onclick="moveToPage(${startCount+1})"><a class="page-link" >&gt</a></li>
        <li class="page-item" onclick="moveToPage(${lastPage}})"><a class="page-link" >&gt&gt</a></li>`
    }


    document.querySelector(".pagination").innerHTML =paginationHTML;
}

const moveToPage=(pageNum)=>{
    startCount=pageNum;
    getMovie();
}


const goToMain=(e)=>{
    getMainMovie();
}


getMainMovie();