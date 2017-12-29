import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
   super(props);
   this.handleKeyPress = this.handleKeyPress.bind(this);
   this.handleSearch = this.handleSearch.bind(this);
   this.handleRemove = this.handleRemove.bind(this);
   this.state = {results: [], search: '', noresults: false};
  }

  render() {
    return (
      <div className="ui container">
       <div className={(!this.state.results.length)?"search-wrapper":"results-wrapper"}>
        <div className="ui fluid category search">
         <div className={"ui icon input " + ((!this.state.results.length)?"massive":"")}>
          <input className="prompt" type="text" placeholder="Search on Wikipedia ..." value={ this.state.search }
                  onChange={ (event)=> this.change(event) } onKeyPress={this.handleKeyPress}/>
          <i className="search icon"></i>
         </div>
         <div className="aux-box">
          or <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank" rel="noopener noreferrer" > Get Random Article</a>
          {(!this.state.results.length)?<span></span>:<span> | <a href="" onClick={this.handleRemove}>Clear</a></span>}
         </div>
         {
           (this.state.results.length)?
            <div className="ui cards grid column one results-box">
             {
              this.state.results.map((item) => {
               return (
                <div className="card column" key={item.pageid}>
                   <div className="content">
                    <a className="header" href={"https://en.wikipedia.org/wiki/" + item.title} target="_blank" rel="noopener noreferrer">{item.title}</a>
                    <div className="meta">
                     <span>{item.extract}</span>
                    </div>
                    <div className="description">
                     <p></p>
                    </div>

                   </div>
                </div>)
              })
             }
            </div>
            :<span></span>
         }
        </div>
       </div>
       {this.state.noresults?
          <div className="ui negative message">
             <i className="close icon" onClick={this.handleRemove}></i>
             <div className="header">
                 Oops!!
             </div>
             <p>There were no results matching the query: <strong>{this.state.search}</strong></p>
          </div>:<span></span>
       }
      </div>
   );
  }

 change(event) {
   this.setState({ search: event.target.value, noresults:false});
 }

 handleSearch() {
  let myHeaders = new Headers({
   "Accept": "*/*",
  });
   const url = `https://en.wikipedia.org/w/api.php?origin=*&format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=15&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=${this.state.search}`;
   fetch(url, { headers: myHeaders})
     .then((response) => {
       return response.json()
     })
     .then((batch) => {
       const pages = (batch.query || {pages:{}}).pages;
       const keys = Object.keys(pages);
       const results = [];

       keys.forEach((key) => {
         results.push(pages[key])
        });

       console.log(results)
       this.setState({results, noresults: results.length === 0});

     })
 }

 handleKeyPress(target) {
   if(target.charCode===13){
      this.handleSearch()
   }
 }

 handleRemove() {
   this.setState({ search: '', results: [], noresults:false});
 }

}

export default App;
